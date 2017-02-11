angular.module('PaperQuikApp').component('pqMainMenu', {
  template: `
    <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">PaperQuik</a>
        </div>
        <div class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <li ng-class="{ 'active' : currentPage === 'home' }"><a href="#!/">Home</a></li>
            <li ng-class="{ 'active' : currentPage === 'about' }"><a href="#!/about">About</a></li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </div>`
});
