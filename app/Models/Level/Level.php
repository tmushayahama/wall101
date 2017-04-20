<?php

namespace App\Models\Level;

use Illuminate\Database\Eloquent\Model;
use App\Models\Component\Component;
use Request;
use DB;
use JWTAuth;

class Level extends Model {

 /**
  * The database table used by the model.
  *
  * @var string
  */
 protected $table = 'ct_level';

 /**
  * The attributes that are mass assignable.
  *
  * @var array
  */
 protected $fillable = ['title', 'description', 'level_id'];

 public static function getLevel($id) {
  $level = Level::find($id);
  return $level;
 }

}
