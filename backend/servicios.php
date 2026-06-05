<?php

// CABECERAS CORS: Cruciales para que Angular en Vercel pueda comunicarse con Render sin bloqueos
header("Content-Type: application/json; charset=UTF-8");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// Si es una petición de tipo OPTIONS (pre-verificación del navegador), respondemos OK y cortamos
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once 'modelo.php';
$modelo = new Modelo();

// Recogemos los datos en formato JSON enviados por Angular
$datos = file_get_contents('php://input');  
$objeto = json_decode($datos);

if($objeto != null) {
    switch($objeto->accion) {
			
        // ==========================================
        //  GESTIÓN DE USUARIOS / AUTENTICACIÓN
        // ==========================================
        
        case "Login": 
            print json_encode($modelo->Login($objeto->email, $objeto->password));
            break;
            
        case "RegistrarUsuario": 
            if ($modelo->RegistrarUsuario($objeto->usuario))
                print '{"result":"OK"}';
            else
                print '{"result":"FAIL"}';
            break;

        case "ModificarUsuario": 
            if ($modelo->ModificarUsuario($objeto->usuario))
                print '{"result":"OK"}';
            else
                print '{"result":"FAIL"}';
            break;

        case "EliminarUsuario":
            $respuesta = $modelo->EliminarUsuario($objeto->id);
            
            if ($respuesta === true) {
                print json_encode(array("result" => "OK"));
            } else if ($respuesta === "HAS_ANIMALS") {
                print json_encode(array("result" => "HAS_ANIMALS"));
            } else {
                print json_encode(array("result" => "FAIL"));
            }
            break;

        case "ListarProtectoras": 
            print json_encode($modelo->ListarProtectoras());
            break;


        // ==========================================
        //  CRUD DE ANIMALES
        // ==========================================
        
        case "ListarAnimales": 
            print json_encode($modelo->ListarAnimales());
            break;
            
        case "ListarAnimalesProtectora": 
            // Lista solo los animales de un usuario en concreto (para su perfil)
            print json_encode($modelo->ListarAnimalesProtectora($objeto->usuario_id));
            break;
            
        case "ObtenerAnimalId": 
            print json_encode($modelo->ObtenerAnimalId($objeto->id));
            break;
            
        case "AltaAnimal": 
            if ($modelo->AltaAnimal($objeto->animal))
                print '{"result":"OK"}';
            else
                print '{"result":"FAIL"}';
            break;
            
        case "ModificaAnimal": 
            if ($modelo->ModificaAnimal($objeto->animal))
                print '{"result":"OK"}';
            else
                print '{"result":"FAIL"}';
            break;
            
        case "BorraAnimal": 
            if ($modelo->BorraAnimal($objeto->id))
                print '{"result":"OK"}';
            else
                print '{"result":"FAIL"}';
            break;
    }
}
?>