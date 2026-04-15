<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApplicationStatusLog extends Model
{
    protected $fillable = [
        'application_id',
        'status',
        'notes',
    ];

    public function application()
    {
        return $this->belongsTo(Application::class);
    }
}
