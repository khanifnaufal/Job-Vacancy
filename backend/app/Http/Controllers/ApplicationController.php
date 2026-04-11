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

    public function store(Request $request)
    {
        $user = $request->user();

        // Prevent recruiters from applying
        if ($user->role === 'recruiter') {
            return response()->json(['message' => 'Recruiters cannot apply for jobs.'], 403);
        }

        $request->validate([
            'vacancy_id' => 'required|exists:vacancies,id',
            'cover_letter' => 'nullable|string',
            'resume' => 'required|file|mimes:pdf|max:2048', // Max 2MB PDF
        ]);

        // Prevent duplicate applications
        $exists = Application::where('user_id', $user->id)
            ->where('vacancy_id', $request->vacancy_id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'You have already applied for this vacancy.'], 422);
        }

        // Store resume
        $path = $request->file('resume')->store('resumes', 'public');

        $application = Application::create([
            'user_id' => $user->id,
            'vacancy_id' => $request->vacancy_id,
            'cover_letter' => $request->cover_letter,
            'resume_path' => $path,
            'status' => 'pending',
            'applied_at' => now(),
        ]);

        return response()->json($application, 201);
    }
}
