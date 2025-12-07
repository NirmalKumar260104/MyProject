import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const routee=inject(Router);
  const Role = sessionStorage.getItem("Role");
  if(Role === "Admin")
  {
    return true;
  }
  routee.navigateByUrl('');
  return false;
  
};
