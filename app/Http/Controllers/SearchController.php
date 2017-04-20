<?php

namespace App\Http\Controllers;

//use Illuminate\Contracts\Auth;
use JWTAuth;
//use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\Component\Component;
use Request;
use DB;

class SearchController extends Controller {

 public function keywordSearch($keyword) {
  $results = Component::SearchByKeyword($keyword)
          ->take(100)
          ->with('type')
          ->with('creator')
          ->get();
  return \Response::json($results);
 }

 public function suggestionSearch($keyword) {
  $results = Component::SearchByKeyword($keyword)
          ->take(10)
          ->with('type')
          ->with('creator')
          ->get();
  return \Response::json($results);
 }

}
