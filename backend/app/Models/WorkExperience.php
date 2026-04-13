<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkExperience extends Model
{
    protected $table = 'work_experiences';

    protected $fillable = [
        'user_id',
        'company',
        'title',
        'location',
        'start_date',
        'end_date',
        'is_current',
        'description',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
