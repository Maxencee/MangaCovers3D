import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { $ } from "./src/utility";

(async function () {
  const context = await fetch("./src/covers.json");
  const mangas = await context.json();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1b1b1b);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  mangas.forEach((manga, k) => {
    $(
      ".manga-list"
    ).innerHTML += `<span class="manga-select" data-id="${k}" id="manga-${k}">${manga.name}</span>`;
  });

  let currentCover = createCover(mangas[0]);
  currentCover.rotateY(-Math.PI / 4);
  scene.add(currentCover);

  $(".manga-list").addEventListener("click", function (evt) {
    if (evt.target?.classList.contains("manga-select")) {
      $(".manga-select.selected")?.classList.remove("selected");
      evt.target.classList.add("selected");

      currentCover?.removeFromParent();
      currentCover = createCover(mangas[parseInt(evt.target.dataset.id)]);
      currentCover.rotateY(-Math.PI / 4);
      scene.add(currentCover);
    }
  });

  $("#manga-0").classList.add("selected");

  function createCover(cover) {
    const manga = new THREE.Group();
    new THREE.TextureLoader().load(
      `./covers/${cover.cover}`,
      function (texture) {
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        const bwidth = texture.image.width / 200;
        const bheight = texture.image.height / 200;

        let rx = (cover.clamps[1] - cover.clamps[0]) / 100;
        let ox = cover.clamps[0] / 100;
        texture.offset = new THREE.Vector2(ox, 0);
        texture.repeat.set(rx, 1);

        const cover1 = new THREE.BoxGeometry(
          ((cover.clamps[1] - cover.clamps[0]) * bwidth) / 100,
          bheight,
          0.02
        );
        const mat1 = new THREE.MeshBasicMaterial({ map: texture });
        const cover1Mesh = new THREE.Mesh(cover1, mat1);
        cover1Mesh.position.set(0, 0, -0.01);
        manga.add(cover1Mesh);

        // 2

        const texture2 = texture.clone();
        rx = (cover.clamps[2] - cover.clamps[1]) / 100;
        ox = cover.clamps[1] / 100;
        texture2.offset = new THREE.Vector2(ox, 0);
        texture2.repeat.set(rx, 1);

        let sx = ((cover.clamps[2] - cover.clamps[1]) * bwidth) / 100;
        const cover2 = new THREE.BoxGeometry(sx - 0.009, bheight, 0.02);
        const mat2 = new THREE.MeshBasicMaterial({ map: texture2 });
        const cover2Mesh = new THREE.Mesh(cover2, mat2);
        cover2Mesh.rotateY(Math.PI / 2);
        cover2Mesh.position.set(
          ((cover.clamps[1] - cover.clamps[0]) * bwidth) / 100 / 2 - 0.0099,
          0,
          -sx / 2
        );
        manga.add(cover2Mesh);

        // 3

        const texture3 = texture.clone();
        rx = (cover.clamps[1] - cover.clamps[0]) / 100;
        ox = cover.clamps[2] / 100;
        texture3.offset = new THREE.Vector2(ox, 0);
        texture3.repeat.set(rx, 1);

        let cx = ((cover.clamps[1] - cover.clamps[0]) * bwidth) / 100;
        const cover3 = new THREE.BoxGeometry(cx, bheight, 0.02);
        const mat3 = new THREE.MeshBasicMaterial({ map: texture3 });
        const cover3Mesh = new THREE.Mesh(cover3, mat3);
        cover3Mesh.rotateY(Math.PI);
        cover3Mesh.position.set(0, 0, -sx + 0.01);
        manga.add(cover3Mesh);

        const pageTexture = new THREE.TextureLoader().load(
          `./pagesTexture.jpg`
        );
        pageTexture.repeat.set(1, 0.3);

        const inner = new THREE.BoxGeometry(
          cx - 0.03,
          bheight - 0.03,
          sx - 0.01
        );
        const innerMat = new THREE.MeshBasicMaterial({ map: pageTexture });
        const innerMesh = new THREE.Mesh(inner, innerMat);
        innerMesh.position.set(0, 0, -sx / 2);

        const innerSide = new THREE.PlaneGeometry(bheight - 0.03, sx - 0.06);
        const innerSideMat = new THREE.MeshBasicMaterial({ map: pageTexture });
        const innerSideMesh = new THREE.Mesh(innerSide, innerSideMat);
        innerSideMesh.rotateY(-Math.PI / 2);
        innerSideMesh.rotateZ(-Math.PI / 2);
        innerSideMesh.position.set(-cx / 2 + 0.014, 0, 0);
        innerMesh.add(innerSideMesh);

        manga.add(innerMesh);
      }
    );

    return manga;
  }

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  controls.zoomSpeed = 1;
  controls.minDistance = 4;
  controls.maxDistance = 12;
  controls.rotateSpeed = 0.65;

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
})();
