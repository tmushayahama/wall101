<?php

namespace App\Models\Component;

use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Model;
use App\Models\Level\Level;
use App\Models\User\User;
use Request;
use DB;
use JWTAuth;

/**
 * This is a SkillSection's component model. A component is a base of every component found in
 * SkillSection.
 * Follwing is list of components derived from Component. They have shared properties This has helped
 * to reduce the number database tables and simplified it.
 *
 * - Cat
 * 
 *
 */
class Component extends Model {

 /**
  * The default value for a newly created component
  *
  * var string
  */
 const DEFAULT_PICTURE_URL = 'default.png';

 /**
  * The default value for a component limit
  *
  * var int
  */
 const COMPONENT_LIMIT = 30;

 /**
  * The database table used by the model gb_component.
  *
  * @var string
  */
 protected $table = 'ct_component';

 /**
  * The attributes that are mass assignable.
  *
  * @var array
  */
 protected $fillable = ['title', 'description'];

 /**
  * Defines the creator's many to one relationship with a component
  *
  * @return type creator relationship
  */
 public function creator() {
  return $this->belongsTo('App\Models\User\User', 'creator_id');
 }

 /**
  * Defines the creator's many to one relationship with it's parent component
  *
  * @return type creator relationship
  */
 public function parentComponent() {
  return $this->belongsTo('App\Models\Component\Component', 'parent_component_id');
 }

 /**
  * Defines the level type's many to one relationship with a component
  *
  * @return type level type relationship
  */
 public function type() {
  return $this->belongsTo('App\Models\Level\Level', 'type_id');
 }

 /**
  * Get component by location of x and y
  *
  * @param $x the x coordinates of a the component
  * @param $y the y coordinates of a the component
  *
  * @return found component
  */
 public static function calibrateComponent($componentId) {
  $user = JWTAuth::parseToken()->toUser();
  $userId = $user->id;

  if ($userId) {
   $locationX = Request::get("locationX");
   $locationY = Request::get("locationY");
   $ratio = Request::get("ratio");

   $component = Component::find($componentId);
   $component->location_x = $locationX;
   $component->location_y = $locationY;
   $component->ratio = $ratio;

   DB::beginTransaction();
   try {
    $component->save();
   } catch (\Exception $e) {
    //failed logic here
    DB::rollback();
    throw $e;
   }
   DB::commit();
   return $component;
  } else {
   return [];
  }
 }

 /**
  * Get component by location of x and y
  *
  * @param $x the x coordinates of a the component
  * @param $y the y coordinates of a the component
  *
  * @return found component
  */
 public static function getComponentByLocation($animal) {
  $howMany = 1;
  $query = Component::orderBy('order', 'desc')
          ->where('type_id', $animal)
          //->with('creator')
          //->with('type')
          ->take(50)
          ->get();

  $component = (new Collection($query))
          ->random($howMany);

  return $component;
 }

 /**
  * Get component by location of x and y
  *
  * @param $x the x coordinates of a the component
  * @param $y the y coordinates of a the component
  *
  * @return found component
  */
 public static function getComponents($animal, $page) {
  $animalName = Level::getLevel($animal);
  $offset = $page * Component::COMPONENT_LIMIT;
  $components = Component::orderBy('order', 'desc')
          ->where('type_id', $animal)
          ->with('type')
          ->take(Component::COMPONENT_LIMIT)
          ->offset($offset)
          ->get();

  $result = array();
  $result['type'] = $animalName->title;
  $result["components"] = $components;
  $result["page"] = $page;

  return $result;
 }

 /**
  * Get a random component by type. Used for Swipe and Matcher
  *
  * @param type $typeId a component type
  * @return type random component
  */
 public static function getRandomComponent($typeId = null) {
  $howMany = 1;
  $query = Component::with('creator')
          ->with('type')
          ->take(500);

  if ($typeId) {
   $query = $query->where('type_id', $typeId);
  }

  $query = $query->get();

  $component = (new Collection($query))
          ->random($howMany);

  return $component;
 }

 /**
  * Helper function to get a component statistics
  *
  * @param type $componentId an id of the component
  * @return type
  */
 private static function getComponentStats($componentId) {
  return array(
      "activities_count" => Component::
              where('parent_component_id', $componentId)
              ->count(),
      "contributors_count" => ComponentContribution::
              where('component_id', $componentId)
              ->count(),
      "discussions_count" => 0,
  );
 }

 /**
  * Keyword search querybuilder
  *
  * @param type $query
  * @param type $keyword
  * @return type
  */
 public function scopeSearchByKeyword($query, $keyword) {
  if ($keyword != '') {
   $query->where(function ($query) use ($keyword) {
    $query->where("title", "LIKE", "%$keyword%")
            ->orWhere("description", "LIKE", "%$keyword%");
   });
  }
  return $query;
 }

}
