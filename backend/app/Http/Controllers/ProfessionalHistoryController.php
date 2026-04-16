<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\WorkExperience;
use App\Models\Education;
use App\Models\Certificate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

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

    // Certificate
    public function storeCertificate(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'issuing_organization' => 'required|string|max:255',
            'issue_date' => 'required|date',
            'expiration_date' => 'nullable|date|after_or_equal:issue_date',
            'credential_url' => 'nullable|url',
            'certificate_file' => 'nullable|file|mimes:pdf|max:2048',
        ]);

        $certificate = $request->user()->certificates()->create([
            'name' => $validated['name'],
            'issuing_organization' => $validated['issuing_organization'],
            'issue_date' => $validated['issue_date'],
            'expiration_date' => $validated['expiration_date'] ?? null,
            'credential_url' => $validated['credential_url'] ?? null,
        ]);

        if ($request->hasFile('certificate_file')) {
            $path = $request->file('certificate_file')->store('certificates', 'public');
            $certificate->update(['file_path' => $path]);
        }

        return response()->json($certificate, 201);
    }

    public function updateCertificate(Request $request, Certificate $certificate)
    {
        if ($certificate->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'issuing_organization' => 'sometimes|required|string|max:255',
            'issue_date' => 'sometimes|required|date',
            'expiration_date' => 'nullable|date|after_or_equal:issue_date',
            'credential_url' => 'nullable|url',
            'certificate_file' => 'nullable|file|mimes:pdf|max:2048',
        ]);

        $certificate->update($request->only(['name', 'issuing_organization', 'issue_date', 'expiration_date', 'credential_url']));

        if ($request->hasFile('certificate_file')) {
            if ($certificate->file_path) {
                Storage::disk('public')->delete($certificate->file_path);
            }
            $path = $request->file('certificate_file')->store('certificates', 'public');
            $certificate->update(['file_path' => $path]);
        }

        return response()->json($certificate);
    }

    public function destroyCertificate(Request $request, Certificate $certificate)
    {
        if ($certificate->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($certificate->file_path) {
            Storage::disk('public')->delete($certificate->file_path);
        }

        $certificate->delete();
        return response()->json(['message' => 'Certificate deleted successfully']);
    }
}
