<?php

namespace App\Http\Controllers;

use App\Models\InterviewSlot;
use App\Models\Vacancy;
use App\Models\Application;
use Illuminate\Http\Request;

class InterviewSlotController extends Controller
{
    public function index(Vacancy $vacancy)
    {
        // Seeker sees only available slots, Recruiter sees everything
        $user = auth()->user();
        
        $query = $vacancy->interviewSlots();

        if ($user->role === 'seeker') {
            $query->where(function($q) use ($user) {
                $q->where('status', 'available')
                  ->orWhere('application_id', function($sub) use ($user) {
                      $sub->select('id')
                          ->from('applications')
                          ->where('user_id', $user->id);
                  });
            });
        }

        return response()->json($query->orderBy('start_time')->get());
    }

    public function store(Request $request, Vacancy $vacancy)
    {
        // Only the company that owns the vacancy can create slots
        if ($request->user()->company->id !== $vacancy->company_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'slots' => 'required|array',
            'slots.*.start_time' => 'required|date',
            'slots.*.end_time' => 'required|date|after:slots.*.start_time',
            'slots.*.location' => 'nullable|string',
        ]);

        foreach ($validated['slots'] as $slotData) {
            $vacancy->interviewSlots()->create($slotData);
        }

        return response()->json($vacancy->interviewSlots()->get(), 201);
    }

    public function book(Request $request, InterviewSlot $slot)
    {
        $user = $request->user();

        if ($user->role !== 'seeker') {
            return response()->json(['message' => 'Only seekers can book interviews'], 403);
        }

        if ($slot->status === 'booked') {
            return response()->json(['message' => 'Slot already booked'], 422);
        }

        // Check if the seeker has an application for this vacancy with status 'interview'
        $application = Application::where('user_id', $user->id)
            ->where('vacancy_id', $slot->vacancy_id)
            ->where('status', 'interview')
            ->first();

        if (!$application) {
            return response()->json(['message' => 'You must have an application in interview status to book this slot'], 403);
        }

        // Check if seeker already booked a slot for this vacancy
        $alreadyBooked = InterviewSlot::where('vacancy_id', $slot->vacancy_id)
            ->where('application_id', $application->id)
            ->exists();

        if ($alreadyBooked) {
            return response()->json(['message' => 'You have already booked an interview for this job'], 422);
        }

        $slot->update([
            'application_id' => $application->id,
            'status' => 'booked',
        ]);

        return response()->json($slot);
    }

    public function destroy(Request $request, InterviewSlot $slot)
    {
        // Only company owner can delete
        if ($request->user()->company->id !== $slot->vacancy->company_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $slot->delete();

        return response()->json(['message' => 'Slot deleted']);
    }
}
