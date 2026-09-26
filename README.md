PrivateOS
An OS designed to run local files!
![alt text](image.png)

In order to test it out use the [Github Pages](https://suvrathkesaraju-lgtm.github.io/PrivateOS/) Deployement

- Features a full desktop with a appdock and a top bar
- top bar features a time widget and features a battery widget(MUST USE CHROMIUM BASED BROWSER ex: chrome, edge. Does not work on Firefox or Brave)
- Features a notes app where you can write down notes and save it to a local txt file
- features an  audio player that lets you select a local audio file and play it!

It works by using divs to create windows which have a defined structure in css and each app has its own backend in script.js. For example the notes app converts the written text in the text area into a .txt file then creates a temporary url for the txt file and after the user downloads the file that temporary download URL is deleted.