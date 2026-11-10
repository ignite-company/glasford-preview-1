(function(){
  const menus=Array.from(document.querySelectorAll(".gl-mobile-menu,.inner-nav .menu"));
  document.addEventListener("pointerdown",function(event){
    menus.forEach(function(menu){if(menu.open&&!menu.contains(event.target))menu.open=false;});
  });
  document.querySelectorAll(".nav-mobile-group").forEach(function(group){
    group.addEventListener("toggle",function(){
      if(!group.open)return;
      const parent=group.closest(".gl-mobile-menu,.inner-nav .menu");
      if(!parent)return;
      parent.querySelectorAll(".nav-mobile-group").forEach(function(other){if(other!==group)other.open=false;});
    });
  });
})();