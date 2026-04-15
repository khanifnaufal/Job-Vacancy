<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CompanyController extends Controller
{
    public function myCompany(Request $request)
    {
        $user = $request->user();
        
        // Ensure company exists for recruiter, or return 404 for others
        if ($user->role !== 'recruiter') {
            return response()->json(['message' => 'Only recruiters have company profiles.'], 403);
        }

        $company = Company::firstOrCreate(
            ['user_id' => $user->id],
            [
                'name' => 'My Company',
                'email' => $user->email,
                'location' => 'Update Location',
                'description' => 'Update Description',
            ]
        );

        return response()->json($company);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        
        if ($user->role !== 'recruiter') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:companies,email,' . ($user->company->id ?? 0),
            'website' => 'nullable|string|max:255',
            'location' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'logo' => 'nullable|image|max:2048', // 2MB max
        ]);

        $company = Company::where('user_id', $user->id)->firstOrFail();

        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($company->logo_path) {
                Storage::disk('public')->delete($company->logo_path);
            }
            
            $path = $request->file('logo')->store('logos', 'public');
            $validated['logo_path'] = $path;
        }

        $company->update($validated);

        return response()->json($company);
    }
    public function show($id)
    {
        $company = Company::with(['vacancies' => function($query) {
            $query->where('status', true)
                  ->where(function($q) {
                      $q->where('deadline', '>=', now()->toDateString())
                        ->orWhereNull('deadline');
                  })
                  ->orderBy('created_at', 'desc');
        }])->findOrFail($id);

        return response()->json($company);
    }
}
