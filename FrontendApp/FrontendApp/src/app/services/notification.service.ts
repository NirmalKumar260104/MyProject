import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  ShowMessage(message : string ,status : string, duration : number){
    const notificationDiv = document.createElement('div');
    notificationDiv.innerText = message;
    notificationDiv.className = 'notification-popup';
    if(status == "good")
    {
      notificationDiv.style.color= "white";
    }
    else if(status == "bad")
    {
      notificationDiv.style.color= "red";
    }

    document.body.appendChild(notificationDiv);

    setTimeout(() => {
      notificationDiv.remove();
    }, duration);
  }
}
