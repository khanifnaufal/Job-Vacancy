<?php

namespace App\Http\Controllers;

use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user()->load('profile');
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
            ]
        );

        if ($request->hasFile('resume')) {
            // Delete old resume if exists
            if ($profile->resume_path) {
                Storage::disk('public')->delete($profile->resume_path);
            }
            
            $path = $request->file('resume')->store('resumes', 'public');
            $profile->update(['resume_path' => $path]);
        }

        return response()->json($user->load('profile'));
    }
}
