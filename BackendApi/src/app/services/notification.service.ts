import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  imageSrc : string = '' ;
  ShowMessage(message : string ,status : string, duration : number){
    const notificationDiv = document.createElement('div');
    
    if(status == "good")
    {
      this.imageSrc = "tick.svg";
    }
    else if(status == "info")
    {
      this.imageSrc = "filen.svg";
    }
    else if(status == "notify")
    {
      this.imageSrc = "redbell.svg";
    }
    else if(status == "delete"){
      this.imageSrc = "deletebin.svg";
    }
    else if(status == "warn")
      {
        this.imageSrc = "warn.svg";
      }

    notificationDiv.remove();
    notificationDiv.innerHTML = `
          <div class="ContentContainer">
                <span class="statusimage">
                    <img src=${this.imageSrc} alt="">
                </span>
                <span class="MessageContainer">
                    <p class="Messages">${message}</p>
                </span>
                <span class="CloseContainer">
                  <img src="closewhite.png" alt="" onclick="this.parentElement.parentElement.parentElement.remove()">
                </span>
          </div>
    `;
    notificationDiv.className = 'NotificationContainer';
    document.body.appendChild(notificationDiv);
    console.log("Finish");

    setTimeout(() => {
      notificationDiv.remove();}, duration);
  }

}
