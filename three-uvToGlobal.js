/**
 * @param {THREE.Mesh} mesh
 * @param {THREE.Vector2} point
 * @returns {THREE.Vector3[]}
 */
var uvToGlobal = function (mesh, point) {
    mesh.geometry.uvsNeedUpdate(true);
    var a, b, c, i, uv, face, uvs, faces, vertices, matrix, matrix2, point3, result;
    result   = [];
    uvs      = mesh.geometry.faceVertexUvs[0];
    faces    = mesh.geometry.faces;
    vertices = mesh.geometry.vertices;
    matrix   = new THREE.Matrix4();
    matrix2  = new THREE.Matrix4();
    scene.updateMatrixWorld(true);
    for (i = 0; i < uvs.length; i++) {
        uv   = uvs[i];
        face = faces[i];
        if (inUV(uv, point)) {
            a = vertices[face.a].clone().applyMatrix4(mesh.matrixWorld);
            b = vertices[face.b].clone().applyMatrix4(mesh.matrixWorld);
            c = vertices[face.c].clone().applyMatrix4(mesh.matrixWorld);

            matrix.set(
                a.x, a.y, a.z, 0,
                b.x, b.y, b.z, 0,
                c.x, c.y, c.z, 0,
                0,   0,   0,   1
            );
            matrix2.set(
                uv[0].x, uv[0].y, 0, 1,
                uv[1].x, uv[1].y, 0, 1,
                uv[2].x, uv[2].y, 0, 1,
                0,       0,       1, 0
            );
            matrix2.getInverse(matrix2);
            matrix.multiplyMatrices(matrix2, matrix);
            matrix.transpose();
            point3 = new THREE.Vector3(point.x, point.y, 0);
            result.push(point3.applyMatrix4(matrix));
        }
    }
    return result;
};