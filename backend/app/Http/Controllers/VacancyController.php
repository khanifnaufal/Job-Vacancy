<?php

namespace App\Http\Controllers;

use App\Models\Vacancy;
use Illuminate\Http\Request;

class VacancyController extends Controller
{
    public function index(Request $request)
    {
        $query = Vacancy::with('company');

        if ($title = $request->input('title')) {
            $query->where('title', 'like', '%' . $title . '%');
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function recruiterVacancies(Request $request)
    {
        $companyId = $request->user()->company?->id;
        
        if (!$companyId) {
            return response()->json([], 200);
        }

        $vacancies = Vacancy::where('company_id', $companyId)
            ->withCount('applications')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($vacancies);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        
        // Ensure company exists for recruiter
        $company = \App\Models\Company::firstOrCreate(
            ['user_id' => $user->id],
            [
                'name' => 'My Company',
                'email' => $user->email,
                'location' => 'Update Location',
                'description' => 'Update Description',
            ]
        );

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'salary' => 'nullable|string|max:255',
            'job_type' => 'required|in:full-time,part-time,contract,remote',
            'experience_level' => 'required|string|max:255',
            'deadline' => 'nullable|date',
            'status' => 'boolean',
        ]);

        $validated['company_id'] = $company->id;
        $validated['company'] = $company->name; // Backward compatibility

        $vacancy = Vacancy::create($validated);
        return response()->json($vacancy, 201);
    }

    public function show($id)
    {
        $vacancy = Vacancy::with('company')->find($id);

        if (!$vacancy) {
            return response()->json(['message' => 'Vacancy not found'], 404);
        }

        return response()->json($vacancy);
    }

    public function update(Request $request, $id)
    {
        $vacancy = Vacancy::find($id);

        if (!$vacancy) {
            return response()->json(['message' => 'Vacancy not found'], 404);
        }

        // Ownership check
        if ($vacancy->company_id !== $request->user()->company?->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'location' => 'sometimes|required|string|max:255',
            'salary' => 'nullable|string|max:255',
            'job_type' => 'sometimes|required|in:full-time,part-time,contract,remote',
            'experience_level' => 'sometimes|required|string|max:255',
            'deadline' => 'nullable|date',
            'status' => 'boolean',
        ]);

        $vacancy->update($validated);
        return response()->json($vacancy);
    }

    public function destroy($id)
    {
        $vacancy = Vacancy::find($id);

        if (!$vacancy) {
            return response()->json(['message' => 'Vacancy not found'], 404);
        }

        // Ownership check
        if ($vacancy->company_id !== $request->user()->company?->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $vacancy->delete();
        return response()->json(['message' => 'Vacancy deleted successfully']);
    }
}
