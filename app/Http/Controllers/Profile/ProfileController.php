<?php

namespace App\Http\Controllers\Profile;

//use Illuminate\Contracts\Auth;
use JWTAuth;
//use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\Level\Level;
use App\Models\User\User;
use App\Models\User\UserProfileSection;
use App\Models\User\UserConnection;
use App\Models\Profile\ProfileComment;
use App\Models\Profile\ProfileNote;
use App\Models\Profile\ProfileTodo;
use App\Models\Profile\ProfileWeblink;
use App\Models\Todo\Todo;
use App\Models\Todo\TodoChecklist;
use App\Models\Comment\Comment;
use App\Models\Note\Note;
use App\Models\Weblink\Weblink;
use App\Models\Profile\ProfileSwipe;
use Request;
use DB;

class ProfileController extends Controller {

 public function getProfile($id) {
  $profile = User::getProfile($id);
  return \Response::json($profile);
 }

 public static function getUserConnections($userId) {
  $userConnection = UserConnection::getUserConnections($userId);
  return \Response::json($userConnection);
 }

 public function createProfile() {
  $profile = Profile::createProfile();
  return \Response::json($profile);
 }

 public function editProfile() {
  $profile = Profile::editProfile();
  return \Response::json($profile);
 }

}
