const socket=io('/');
const videoGrid=document.getElementById('video-grid');
let myVideoStream;
const myVideo=document.createElement('video');
myVideo.muted=true;
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
    myVideoStream=stream;
    addVideoStream(myVideo,stream);
})

socket.emit('join-room',Room_Id);

socket.on('user-connected',()=>{
    connectToNewUser();
})

const connectToNewUser=()=>{
    console.log('new user');
}

const addVideoStream=(video,stream)=>{
    video.srcObject=stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videoGrid.append(video);
}