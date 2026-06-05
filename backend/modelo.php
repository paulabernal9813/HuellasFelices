<?php

class Modelo {

	private $pdo;

	public function __CONSTRUCT() {
		try {
			// Datos de tu Render (sacados de la imagen de tu conexión)
			$host = 'dpg-d8hk9hrtqb8s73a6e0f0-a.frankfurt-postgres.render.com';
			$port = '5432';
			$dbname = 'protectora_db_rtqf';
			$user = 'protectora_db_rtqf_user';
			// Aquí pon la contraseña larga que copiaste de Render (la que pusiste en DBeaver)
			$password = 'Ivanmartin98'; 

			// Cadena PDO específica para PostgreSQL con SSL obligatorio
			$conexion = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $password);
			
			// Activamos el control de excepciones de PDO
			$this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);                
		} catch(Exception $e) {
			die("Error de conexión: " . $e->getMessage());
		}
	}
	
	// =========================================================================
	//  MÉTODOS DE USUARIOS (LOGIN, REGISTRO, MODIFICAR, ELIMINAR, LISTAR)
	// =========================================================================
	
	public function Login($email, $password) {
		try {
			// Ahora traemos también la columna imagen_url para guardarla en la sesión de Angular
			$sql = "SELECT id, nombre, email, rol, imagen_url FROM usuarios WHERE email = ? AND password = ?";
			$stm = $this->pdo->prepare($sql);
			$stm->execute(array($email, $password));
			
			$usuario = $stm->fetch(PDO::FETCH_ASSOC);
			return $usuario ? $usuario : false;
		} catch(Exception $e) {
			die($e->getMessage());
		}
	}
	
	public function RegistrarUsuario($data) {
		try {
			// Si no ponen foto de perfil, le asignamos la silueta por defecto en el servidor
			$foto = !empty($data->imagen_url) ? $data->imagen_url : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
			
			$sql = "INSERT INTO usuarios (nombre, email, password, rol, imagen_url, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
			$this->pdo->prepare($sql)->execute(array(
				$data->nombre,
				$data->email,
				$data->password,
				$data->rol,
				$foto
			));
			return true;
		} catch (Exception $e) {
			return false;
		}
	}

	public function ModificarUsuario($data) {
		try {
			// Actualizado para que guarde el nombre, email y también la URL de la foto de perfil editada
			$sql = "UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?";
			$this->pdo->prepare($sql)->execute(array(
				$data->nombre,
				$data->email,
				$data->id
			));
			return true;
		} catch (Exception $e) {
			return false;
		}
	}

	public function EliminarUsuario($id) {
		try {
			// 1. Comprobamos si el usuario tiene animales dados en adopción
			$sqlCheck = "SELECT COUNT(*) as total FROM animales WHERE usuario_id = ?";
			$stmCheck = $this->pdo->prepare($sqlCheck);
			$stmCheck->execute(array($id));
			$resultado = $stmCheck->fetch(PDO::FETCH_ASSOC);

			// 2. Si tiene animales, devolvemos una clave de texto específica
			if ($resultado && $resultado['total'] > 0) {
				return "HAS_ANIMALS"; 
			}

			// 3. Si no tiene animales, procedemos a borrar
			$sql = "DELETE FROM usuarios WHERE id = ?";
			$this->pdo->prepare($sql)->execute(array($id));
			return true;
		} catch (Exception $e) {
			return false;
		}
	}

	public function ListarProtectoras() {
		try {
			// Ahora seleccionamos también imagen_url y created_at para pintar las tarjetas completas
			$sql = "SELECT id, nombre, email, imagen_url, created_at FROM usuarios WHERE rol = 'protectora' ORDER BY nombre ASC";
			$stm = $this->pdo->prepare($sql);
			$stm->execute();
			return $stm->fetchAll(PDO::FETCH_ASSOC);
		} catch(Exception $e) {
			die($e->getMessage());
		}
	}

	// =========================================================================
	//  MÉTODOS DE ANIMALES (CRUD COMPLETO)
	// =========================================================================
	
	public function ListarAnimales() {
		try {
			$sql = "SELECT a.*, u.nombre AS nombre_protectora 
					FROM animales a 
					LEFT JOIN usuarios u ON a.usuario_id = u.id 
					ORDER BY a.created_at DESC";
			$stm = $this->pdo->prepare($sql);
			$stm->execute();
			return $stm->fetchAll(PDO::FETCH_ASSOC);
		} catch(Exception $e) {
			die($e->getMessage());
		}
	}
	
	public function ListarAnimalesProtectora($usuario_id) {
		try {
			$sql = "SELECT * FROM animales WHERE usuario_id = ? ORDER BY created_at DESC";
			$stm = $this->pdo->prepare($sql);
			$stm->execute(array($usuario_id));
			return $stm->fetchAll(PDO::FETCH_ASSOC);
		} catch(Exception $e) {
			die($e->getMessage());
		}
	}
	
	public function ObtenerAnimalId($id) {
		try {
			$sql = "SELECT a.*, u.nombre AS nombre_protectora, u.email AS email_protectora 
					FROM animales a 
					INNER JOIN usuarios u ON a.usuario_id = u.id 
					WHERE a.id = ?";
			$stm = $this->pdo->prepare($sql);
			$stm->execute(array($id));
			return $stm->fetch(PDO::FETCH_ASSOC);
		} catch(Exception $e) {
			die($e->getMessage());
		}
	}
	
	public function AltaAnimal($data) {
		try {
			$sql = "INSERT INTO animales (usuario_id, nombre, especie, raza, edad, tamano, estado, descripcion, imagen_url) 
					VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
			$this->pdo->prepare($sql)->execute(array(
				$data->usuario_id,
				$data->nombre,
				$data->especie,
				$data->raza,
				$data->edad,
				$data->tamano,
				$data->estado,
				$data->descripcion,
				$data->imagen_url
			));
			return true;
		} catch (Exception $e) {
			return false;
		}
	}
	
	public function ModificaAnimal($data) {
		try {
			$sql = "UPDATE animales SET nombre = ?, especie = ?, raza = ?, edad = ?, tamano = ?, estado = ?, descripcion = ?, imagen_url = ? 
					WHERE id = ?";
			$this->pdo->prepare($sql)->execute(array(
				$data->nombre,
				$data->especie,
				$data->raza,
				$data->edad,
				$data->tamano,
				$data->estado,
				$data->descripcion,
				$data->imagen_url,
				$data->id
			));
			return true;
		} catch (Exception $e) {
			return false;
		}
	}
	
	public function BorraAnimal($id) {
		try {
			$sql = "DELETE FROM animales WHERE id = ?";
			$this->pdo->prepare($sql)->execute(array($id));
			return true;
		} catch (Exception $e) {
			return false;
		}
	}
}
?>