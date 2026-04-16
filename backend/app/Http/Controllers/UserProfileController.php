<?php

namespace App\Http\Controllers;

use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user()->load(['profile', 'workExperiences', 'educations', 'certificates']);
        return response()->json($user);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'summary' => 'nullable|string',
            'skills' => 'nullable|string',
            'resume' => 'nullable|file|mimes:pdf|max:2048',
            'avatar' => 'nullable|image|max:2048',
            'linkedin_url' => 'nullable|url',
            'github_url' => 'nullable|url',
            'portfolio_url' => 'nullable|url',
        ]);

        if (isset($validated['name'])) {
            $user->update(['name' => $validated['name']]);
        }

        $profile = UserProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'phone' => $validated['phone'] ?? $user->profile?->phone,
                'summary' => $validated['summary'] ?? $user->profile?->summary,
                'skills' => $validated['skills'] ?? $user->profile?->skills,
                'linkedin_url' => $validated['linkedin_url'] ?? $user->profile?->linkedin_url,
                'github_url' => $validated['github_url'] ?? $user->profile?->github_url,
                'portfolio_url' => $validated['portfolio_url'] ?? $user->profile?->portfolio_url,
            ]
        );

        if ($request->hasFile('resume')) {
            if ($profile->resume_path) {
                Storage::disk('public')->delete($profile->resume_path);
            }
            $path = $request->file('resume')->store('resumes', 'public');
            $profile->update(['resume_path' => $path]);
        }

        if ($request->hasFile('avatar')) {
            if ($profile->avatar_path) {
                Storage::disk('public')->delete($profile->avatar_path);
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $profile->update(['avatar_path' => $path]);
        }

        return response()->json($user->load(['profile', 'workExperiences', 'educations', 'certificates']));
    }
}
