<?php

namespace App\Http\Controllers;

use App\Models\Vacancy;
use Illuminate\Http\Request;

class VacancyController extends Controller
{
    public function index(Request $request)
    {
        $query = Vacancy::query();

        if ($title = $request->input('title')) {
            $query->where('title', 'like', '%' . $title . '%');
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'company' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'salary' => 'nullable|string|max:255',
            'status' => 'boolean',
        ]);

        $vacancy = Vacancy::create($validated);
        return response()->json($vacancy, 201);
    }

    public function show($id)
    {
        $vacancy = Vacancy::find($id);

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

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'company' => 'sometimes|required|string|max:255',
            'location' => 'sometimes|required|string|max:255',
            'salary' => 'nullable|string|max:255',
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

        $vacancy->delete();
        return response()->json(['message' => 'Vacancy deleted successfully']);
    }
}
