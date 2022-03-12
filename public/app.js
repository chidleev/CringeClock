import * as THREE from 'three'
import {OrbitControls} from 'OrbitControls'
import {FlakesTexture} from 'FlakesTexture'

const elementSize = 10
const pi = 3.14159265359
const zoom = 0.2

const scene = new THREE.Scene()
const elementStatus = [
    [0, 0, 0, 0, 0, 0, 1], //0
    [1, 0, 0, 1, 1, 1, 1], //1
    [0, 0, 1, 0, 0, 1, 0], //2
    [0, 0, 0, 0, 1, 1, 0], //3
    [1, 0, 0, 1, 1, 0, 0], //4
    [0, 1, 0, 0, 1, 0, 0], //5
    [0, 1, 0, 0, 0, 0, 0], //6
    [0, 0, 0, 1, 1, 1, 1], //7
    [0, 0, 0, 0, 0, 0, 0], //8
    [0, 0, 0, 0, 1, 0, 0]  //9
]

const renderer = new THREE.WebGLRenderer({
    antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x204040)
document.body.appendChild(renderer.domElement)


//const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const camera = new THREE.OrthographicCamera(-window.innerWidth * zoom, window.innerWidth * zoom, window.innerHeight * zoom, -window.innerHeight * zoom, 0.0001, 10000);
camera.position.set(0, 0, 200)

/*const controls = new OrbitControls(camera, document.body)
controls.enableDamping = true*/


const ambient = new THREE.AmbientLight(0x204040, 1)
scene.add(ambient)

const dirLight = new THREE.DirectionalLight(0xffffff, 1)
dirLight.position.set(0, 0, 100)
scene.add(dirLight)


function Element() {
    this.shape = new THREE.Shape()

    this.shape.moveTo(0, -elementSize)
    this.shape.lineTo(elementSize * 2, - elementSize)
    this.shape.lineTo(elementSize * 3, 0)
    this.shape.lineTo(elementSize * 2, elementSize)
    this.shape.lineTo(-elementSize * 2, elementSize)
    this.shape.lineTo(-elementSize * 3, 0)
    this.shape.lineTo(-elementSize * 2, - elementSize)

    this.extrudeSettings = {
        depth: elementSize/4,
        bevelEnabled: false
    }

    this.geometry = new THREE.ExtrudeBufferGeometry(this.shape, this.extrudeSettings)
    this.geometry.translate(0, 0, -elementSize/8)

    this.mesh = new THREE.Mesh(
        this.geometry, 
        [
            new THREE.MeshPhongMaterial({color: 0xffffff}),
            new THREE.MeshPhongMaterial({color: 0x255050})
        ]
    );

    this.isVertical = 0
}

function ClockNumber() {
    this.elements = []
    for (let i = 0; i < 7; i++) {
        this.elements[i] = new Element()
    }
    

    this.elements[0].mesh.translateOnAxis(new THREE.Vector3(0, 1, 0), elementSize * 6)

    this.elements[1].isVertical = 1
    this.elements[1].mesh.translateOnAxis(new THREE.Vector3(1, 1, 0), elementSize * 3)

    this.elements[2].isVertical = 1
    this.elements[2].mesh.translateOnAxis(new THREE.Vector3(1, -1, 0), elementSize * 3)

    this.elements[3].mesh.translateOnAxis(new THREE.Vector3(0, -1, 0), elementSize * 6)

    this.elements[4].isVertical = 1
    this.elements[4].mesh.translateOnAxis(new THREE.Vector3(-1, -1, 0), elementSize * 3)

    this.elements[5].isVertical = 1
    this.elements[5].mesh.translateOnAxis(new THREE.Vector3(-1, 1, 0), elementSize * 3)


    this.elementsMeshes = new THREE.Group()
    for (let i = 0; i < 7; i++) {
        this.elementsMeshes.add(this.elements[i].mesh)
    }

    scene.add(this.elementsMeshes)
    
    this.speed = 3
    this.currentState = 0

    this.setState = function(stateID, alpha=1) {
        this.elements.forEach((element, id) => {
            const angle = (elementStatus[this.currentState][id] * (1 - alpha * this.speed) + elementStatus[Math.trunc(stateID) % 10][id] * alpha * this.speed) * pi/2
            if (alpha <= 1/this.speed) 
                element.mesh.setRotationFromEuler(new THREE.Euler(angle, 0, pi/2 * element.isVertical, "ZXY"))
            else {
                this.currentState = stateID
                element.mesh.setRotationFromEuler(new THREE.Euler(elementStatus[this.currentState][id] * pi/2, 0, pi/2 * element.isVertical, "ZXY"))
            }
        })
        
    }
}

function Clock() {
    this.numbers = []

    for (let i = 0; i < 6; i++) {
        this.numbers[i] = new ClockNumber()
        this.numbers[i].setState(0)
    }


    this.numbers[0].elementsMeshes.translateX(elementSize * 23)
    this.numbers[1].elementsMeshes.translateX(elementSize * 14.5)
    this.numbers[2].elementsMeshes.translateX(elementSize * 4.25)
    this.numbers[3].elementsMeshes.translateX(-elementSize * 4.25)
    this.numbers[4].elementsMeshes.translateX(-elementSize * 14.5)
    this.numbers[5].elementsMeshes.translateX(-elementSize * 23)


    this.update = function() {
        let time = new Date(Date.now())
        let alpha = time.getMilliseconds() / 1000

        if (this.numbers[0].currentState != time.getSeconds() % 10)
            this.numbers[0].setState(time.getSeconds() % 10, alpha)

        if (this.numbers[1].currentState != Math.floor(time.getSeconds()/10))
            this.numbers[1].setState(Math.floor(time.getSeconds()/10), alpha)

        if (this.numbers[2].currentState != time.getMinutes() % 10) 
            this.numbers[2].setState(time.getMinutes() % 10, alpha)

        if (this.numbers[3].currentState != Math.floor(time.getMinutes()/10)) 
            this.numbers[3].setState(Math.floor(time.getMinutes()/10), alpha)

        if (this.numbers[4].currentState != time.getHours() % 10) 
            this.numbers[4].setState(time.getHours() % 10, alpha)

        if (this.numbers[5].currentState != Math.floor(time.getHours()/10)) 
            this.numbers[5].setState(Math.floor(time.getHours()/10), alpha)
    }

}


const clock = new Clock()

renderer.setAnimationLoop((time) => {
    clock.update()
    renderer.render(scene, camera)
})



window.addEventListener('resize', resize);

function resize()
{
    //camera.aspect = window.innerWidth / window.innerHeight;
    camera.left = -window.innerWidth * zoom;
    camera.right = window.innerWidth * zoom;
    camera.top = window.innerHeight * zoom;
    camera.bottom = -window.innerHeight * zoom;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}