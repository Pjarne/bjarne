const THREE = window.THREE

if (typeof THREE === "undefined") {
  console.error("Three.js is not loaded")
} else {
  console.log("Three.js loaded successfully")
  initThreeJS()
}

function initThreeJS() {
  const canvas = document.getElementById("canvas3d")
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })

  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true

  camera.position.z = 8

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const spotLight = new THREE.SpotLight(0xffffff, 1)
  spotLight.position.set(10, 10, 10)
  spotLight.castShadow = true
  scene.add(spotLight)

  const pointLight = new THREE.PointLight(0xef4444, 0.5)
  pointLight.position.set(-10, -10, -10)
  scene.add(pointLight)

  const cubeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5)
  const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0xef4444,
    emissiveIntensity: 0.2,
  })
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
  cube.castShadow = true
  scene.add(cube)

  const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.9,
    roughness: 0.1,
    wireframe: true,
  })

  const sphere1 = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphere1.position.set(-3, 1, -2)
  scene.add(sphere1)

  const sphere2 = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphere2.position.set(3, -1, -2)
  scene.add(sphere2)

  const sphere3 = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphere3.position.set(0, 2, -3)
  scene.add(sphere3)

  let mouseX = 0
  let mouseY = 0
  let targetMouseX = 0
  let targetMouseY = 0

  document.addEventListener("mousemove", (event) => {
    targetMouseX = (event.clientX / window.innerWidth) * 2 - 1
    targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1
  })

  let time = 0
  let scrollY = window.scrollY

  window.addEventListener("scroll", () => {
    scrollY = window.scrollY
  })

  function animate() {
    requestAnimationFrame(animate)
    time += 0.01

    mouseX += (targetMouseX - mouseX) * 0.05
    mouseY += (targetMouseY - mouseY) * 0.05

    cube.rotation.x += 0.005
    cube.rotation.y += 0.005

    cube.position.y = Math.sin(time) * 0.3 + mouseY * 0.2
    cube.position.x = mouseX * 0.3

    sphere1.position.y = 1 + Math.sin(time * 1.5) * 0.5
    sphere1.rotation.y += 0.01

    sphere2.position.y = -1 + Math.cos(time * 1.2) * 0.5
    sphere2.rotation.y -= 0.01

    sphere3.position.y = 2 + Math.sin(time * 1.8) * 0.5
    sphere3.rotation.x += 0.01

    const parallaxX = mouseX * 0.5
    const parallaxY = mouseY * 0.5

    camera.position.x += (parallaxX - camera.position.x) * 0.05
    camera.position.y += (parallaxY - camera.position.y) * 0.05

    camera.position.z = 8 - scrollY * 0.002

    camera.lookAt(scene.position)

    renderer.render(scene, camera)
  }

  animate()

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

const cursor = document.querySelector(".cursor")
const cursorFollower = document.querySelector(".cursor-follower")

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px"
  cursor.style.top = e.clientY + "px"

  setTimeout(() => {
    cursorFollower.style.left = e.clientX + "px"
    cursorFollower.style.top = e.clientY + "px"
  }, 100)
})

document.querySelectorAll("a, button").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(1.5)"
    cursorFollower.style.transform = "translate(-50%, -50%) scale(2)"
  })

  el.addEventListener("mouseleave", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(1)"
    cursorFollower.style.transform = "translate(-50%, -50%) scale(1)"
  })
})

const revealElements = document.querySelectorAll(".scroll-reveal")

const revealOnScroll = () => {
  const windowHeight = window.innerHeight

  revealElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top
    const revealPoint = 100

    if (elementTop < windowHeight - revealPoint) {
      element.classList.add("revealed")
    }
  })
}

window.addEventListener("scroll", revealOnScroll)
window.addEventListener("load", () => {
  revealOnScroll()
})
revealOnScroll()

const projectCards = document.querySelectorAll(".project-card")

document.addEventListener("mousemove", (e) => {
  projectCards.forEach((card) => {
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = (y - centerY) / 20
    const rotateY = (centerX - x) / 20

    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    } else {
      card.style.transform = "translateY(0) rotateX(0) rotateY(0)"
    }
  })
})
