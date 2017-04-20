<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\Level\Level;

abstract class Controller extends BaseController {

 use AuthorizesRequests,
     DispatchesJobs,
     ValidatesRequests;

 /*
   protected $site_settings;

   public function __construct() {
   $this->site_settings = Level::getLevels();
   }
  */
}
