<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\WorkExperience;
use App\Models\Education;
use Illuminate\Support\Facades\Log;

class ProfessionalHistoryController extends Controller
{
    // Work Experience
    public function storeExperience(Request $request)
    {
        Log::info('Store Experience Request received', $request->all());
        $validated = $request->validate([
            'company' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'boolean',
            'description' => 'nullable|string',
        ]);

        $experience = $request->user()->workExperiences()->create($validated);
        return response()->json($experience, 201);
    }

    public function updateExperience(Request $request, WorkExperience $experience)
    {
        if ($experience->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'company' => 'sometimes|required|string|max:255',
            'title' => 'sometimes|required|string|max:255',
            'location' => 'nullable|string|max:255',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'boolean',
            'description' => 'nullable|string',
        ]);

        $experience->update($validated);
        return response()->json($experience);
    }

    public function destroyExperience(Request $request, WorkExperience $experience)
    {
        if ($experience->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $experience->delete();
        return response()->json(['message' => 'Experience deleted successfully']);
    }

    // Education
    public function storeEducation(Request $request)
    {
        $validated = $request->validate([
            'institution' => 'required|string|max:255',
            'degree' => 'required|string|max:255',
            'field_of_study' => 'nullable|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'description' => 'nullable|string',
        ]);

        $education = $request->user()->educations()->create($validated);
        return response()->json($education, 201);
    }

    public function updateEducation(Request $request, Education $education)
    {
        if ($education->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'institution' => 'sometimes|required|string|max:255',
            'degree' => 'sometimes|required|string|max:255',
            'field_of_study' => 'nullable|string|max:255',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'description' => 'nullable|string',
        ]);

        $education->update($validated);
        return response()->json($education);
    }

    public function destroyEducation(Request $request, Education $education)
    {
        if ($education->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $education->delete();
        return response()->json(['message' => 'Education deleted successfully']);
    }
}
