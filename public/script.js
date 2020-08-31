const socket = io("/");
const videoGrid = document.getElementById("video-grid");
let myVideoStream;
const myVideo = document.createElement("video");
myVideo.muted = true;

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3030",
});

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: false,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", function (call) {
      call.answer(stream);
      console.log("call answered");
      const video = document.createElement("video");
      call.on("stream", (myVideoStream) => {
        addVideoStream(video, myVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
    let text = $("input");

    $("html").keydown((e) => {
      if (e.which == 13 && text.val().length != 0) {
        socket.emit("message", text.val());
        text.val("");
      }
    });

    socket.on("createMessage", (message) => {
        console.log(message);
      $(".messages").append(`<li class="message"><b>user</b><br>${message}</li>`);
    });
  });
peer.on("open", (id) => {
  socket.emit("join-room", Room_Id, id);
});

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  console.log("calling");
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};
