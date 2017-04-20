<?php

/**
 * This is a SkillSection's component controller. A component is a base of every component found in
 * SkillSection.
 *
 */

namespace App\Http\Controllers\Component;

//use Illuminate\Contracts\Auth;
use JWTAuth;
//use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\Component\Component;
use App\Models\Level\Level;
use Request;
use DB;

class ComponentController extends Controller {
 // ******************************
 // Component Methods
 // ******************************

 /**
  * Get component by location of x and y
  *
  * @param $x the x coordinates of a the component
  * @param $y the y coordinates of a the component
  *
  * @return found component
  */
 public function getComponents($animal, $page) {
  $components = Component::getComponents($animal, $page);
  return \Response::json($components);
 }

 /**
  * Get component by location of x and y
  *
  * @param $x the x coordinates of a the component
  * @param $y the y coordinates of a the component
  *
  * @return found component
  */
 public function calibrateComponent($id) {
  $component = Component::calibrateComponent($id);
  return \Response::json($component);
 }

}
