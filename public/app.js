import * as THREE from 'three'
import {OrbitControls} from 'OrbitControls'
import {FlakesTexture} from 'FlakesTexture'

const elementSize = 5
const pi = 3.14159265359
const scene = new THREE.Scene()
const elementStatus = [
    [1, 1, 1, 1, 1, 1, 0], //0
    [0, 1, 1, 0, 0, 0, 0], //1
    [1, 1, 0, 1, 1, 0, 1], //2
    [1, 1, 1, 1, 0, 0, 1], //3
    [0, 1, 1, 0, 0, 1, 1], //4
    [1, 0, 1, 1, 0, 1, 1], //5
    [1, 0, 1, 1, 1, 1, 1], //6
    [1, 1, 1, 0, 0, 0, 0], //7
    [1, 1, 1, 1, 1, 1, 1], //8
    [1, 1, 1, 1, 0, 1, 1]  //9
]

const renderer = new THREE.WebGLRenderer({
    antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0x204040)
document.body.appendChild(renderer.domElement)


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 200)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true


const ambient = new THREE.AmbientLight(0x808080, 1)
scene.add(ambient)

const dirLight = new THREE.DirectionalLight(0xffffff, 1)
dirLight.position.set(0, 200, 100)
scene.add(dirLight)


const number = new ClockNumber()
scene.add(number.elementsMeshes)


function Element() {
    this.shape = new THREE.Shape()

    this.shape.moveTo(0, - elementSize * 2)
    this.shape.lineTo(elementSize * 4, - elementSize * 2)
    this.shape.lineTo(elementSize * 6, 0)
    this.shape.lineTo(elementSize * 4, elementSize * 2)
    this.shape.lineTo(- elementSize * 4, elementSize * 2)
    this.shape.lineTo(- elementSize * 6, 0)
    this.shape.lineTo(- elementSize * 4, - elementSize * 2)

    this.geometry = new THREE.ExtrudeBufferGeometry(this.shape, {depth: elementSize, bevelEnabled: false})
    this.geometry.translate(0, 0, -elementSize/2)

    this.mesh = new THREE.Mesh(
        this.geometry, 
        [
            new THREE.MeshPhongMaterial({color: 0xffffff}),
            new THREE.MeshPhongMaterial({color: 0xff0000})
        ]);
}

function ClockNumber() {
    this.elementsMeshes = new THREE.Group();

    this.elements = []
    for (let i = 0; i < 7; i++) {
        this.elements[i] = new Element()
    }
    
    this.elements[0] = new Element()
    this.elements[0].mesh.translateOnAxis(new THREE.Vector3(0, 1, 0), elementSize * 12)
    //this.elements[0].mesh.rotateX(pi/2)
    this.elementsMeshes.add(this.elements[0].mesh)

    this.elements[1] = new Element()
    this.elements[1].mesh.translateOnAxis(new THREE.Vector3(1, 1, 0), elementSize * 6)
    this.elements[1].mesh.rotateZ(pi/2)
    this.elementsMeshes.add(this.elements[1].mesh)

    this.elements[2] = new Element()
    this.elements[2].mesh.translateOnAxis(new THREE.Vector3(1, -1, 0), elementSize * 6)
    this.elements[2].mesh.rotateZ(pi/2)
    this.elementsMeshes.add(this.elements[2].mesh)

    this.elements[3] = new Element()
    this.elements[3].mesh.translateOnAxis(new THREE.Vector3(0, -1, 0), elementSize * 12)
    //this.elements[3].mesh.rotateX(pi/2)
    this.elementsMeshes.add(this.elements[3].mesh)

    this.elements[4] = new Element()
    this.elements[4].mesh.translateOnAxis(new THREE.Vector3(-1, -1, 0), elementSize * 6)
    this.elements[4].mesh.rotateZ(pi/2)
    //this.elements[4].mesh.rotateX(pi/2)
    this.elementsMeshes.add(this.elements[4].mesh)

    this.elements[5] = new Element()
    this.elements[5].mesh.translateOnAxis(new THREE.Vector3(-1, 1, 0), elementSize * 6)
    this.elements[5].mesh.rotateZ(pi/2)
    //this.elements[5].mesh.rotateX(pi/2)
    this.elementsMeshes.add(this.elements[5].mesh)

    this.elements[6] = new Element()
    this.elements[6].mesh.rotateX(pi/2)
    this.elementsMeshes.add(this.elements[6].mesh)

    this.setStatus = function(elaps, delta) {
        this.elements.forEach((element, id) => {
            element.mesh.rotateX((elementStatus[(elaps + 1) % 10][id] - elementStatus[elaps % 10][id]) * pi * delta)
        })

    }
}


const clock = new THREE.Clock(true)
let delta = 0;
// 30 fps
let interval = 1 / 200;

function animate() {
    if (delta  > interval) {
        number.setStatus(Math.floor(clock.getElapsedTime()), delta)
        delta = delta % interval;
    }

    controls.update()
    renderer.render(scene, camera)

    delta += clock.getDelta()
    
    requestAnimationFrame(animate)
}

animate()