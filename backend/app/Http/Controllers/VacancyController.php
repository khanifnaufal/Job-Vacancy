<?php

namespace App\Http\Controllers;

use App\Models\Vacancy;
use Illuminate\Http\Request;

class VacancyController extends Controller
{
    public function index(Request $request)
    {
        $query = Vacancy::with('company')->withCount('applications');

        // Filter out expired vacancies
        $query->where(function($q) {
            $q->where('deadline', '>=', now()->toDateString())
              ->orWhereNull('deadline');
        });

        if ($title = $request->input('title')) {
            $query->where('title', 'like', '%' . $title . '%');
        }

        if ($location = $request->input('location')) {
            $query->where('location', 'like', '%' . $location . '%');
        }

        if ($jobType = $request->input('job_type')) {
            if ($jobType !== 'all') {
                $query->where('job_type', $jobType);
            }
        }

        if ($experience = $request->input('experience')) {
            if ($experience !== 'all') {
                $query->where('experience_level', $experience);
            }
        }

        $vacancies = $query->orderBy('created_at', 'desc')->get();

        // Check bookmarks for seekers
        $user = $request->user('sanctum');
        if ($user && $user->role === 'seeker') {
            $bookmarkIds = $user->bookmarks()->pluck('vacancy_id')->toArray();
            $vacancies->each(function ($vacancy) use ($bookmarkIds) {
                $vacancy->is_bookmarked = in_array($vacancy->id, $bookmarkIds);
            });
        }

        return response()->json($vacancies);
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
            'job_type' => 'required|in:full-time,part-time,contract,remote,internship',
            'experience_level' => 'required|in:junior,mid,senior,lead',
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
        $vacancy = Vacancy::with('company')->withCount('applications')->find($id);

        if (!$vacancy) {
            return response()->json(['message' => 'Vacancy not found'], 404);
        }

        // Check bookmark for seeker
        $user = request()->user('sanctum');
        if ($user && $user->role === 'seeker') {
            $vacancy->is_bookmarked = $user->bookmarks()->where('vacancy_id', $vacancy->id)->exists();
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
            'job_type' => 'sometimes|required|in:full-time,part-time,contract,remote,internship',
            'experience_level' => 'sometimes|required|in:junior,mid,senior,lead',
            'deadline' => 'nullable|date',
            'status' => 'boolean',
        ]);

        $vacancy->update($validated);
        return response()->json($vacancy);
    }

    public function destroy(Request $request, $id)
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
