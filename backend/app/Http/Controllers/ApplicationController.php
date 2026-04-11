<?php

namespace App\Http\Controllers;

use App\Models\Application;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function recruiterIndex(Request $request)
    {
        $company = $request->user()->company;
        if (!$company) {
            return response()->json([], 200);
        }

        $applications = Application::whereHas('vacancy', function($query) use ($company) {
            $query->where('company_id', $company->id);
        })
        ->with(['user.profile', 'vacancy'])
        ->orderBy('applied_at', 'desc')
        ->get();

        return response()->json($applications);
    }

    public function updateStatus(Request $request, Application $application)
    {
        $company = $request->user()->company;
        
        // Ownership check
        if (!$company || $application->vacancy->company_id !== $company->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,reviewed,interview,accepted,rejected',
            'notes' => 'nullable|string'
        ]);

        $validated['reviewed_at'] = now();

        $application->update($validated);

        return response()->json($application);
    }
}
