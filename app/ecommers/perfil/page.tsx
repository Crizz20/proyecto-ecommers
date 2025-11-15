"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import "../../styles/perfil.css";

interface Usuario {
	nombre?: string;
	email?: string;
	telefono?: string;
	direccion?: string;
}

export default function PerfilPage() {
	const { usuario, logout } = useAuth() as { usuario: Usuario | null; logout: () => void };
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		nombre: "",
		email: "",
		telefono: "",
		direccion: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState("");

	useEffect(() => {
		if (!usuario) {
			router.push("/ecommers/login");
			return;
		}
		setFormData({
			nombre: usuario.nombre || "",
			email: usuario.email || "",
			telefono: usuario.telefono || "",
			direccion: usuario.direccion || "",
		});
	}, [usuario, router]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSave = async () => {
		if (!formData.nombre || !formData.email) {
			setMessage("El nombre y email son requeridos");
			return;
		}

		setIsLoading(true);
		try {
			const token = localStorage.getItem("token");
			
			if (!token) {
				setMessage("No hay sesión activa. Por favor inicia sesión nuevamente.");
				router.push("/ecommers/login");
				return;
			}

			const res = await fetch("/api/usuarios/perfil", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(formData),
			});

			if (!res.ok) {
				const data = await res.json();
				setMessage(data.msg || `Error: ${res.status}`);
				return;
			}

			const data = await res.json();
			setMessage("✅ Perfil actualizado exitosamente");
			setIsEditing(false);
			
			// Actualizar contexto con nuevos datos
			if (usuario) {
				localStorage.setItem("usuario", JSON.stringify({ ...usuario, ...formData }));
			}
			
			setTimeout(() => setMessage(""), 3000);
		} catch (error: unknown) {
			console.error("Error:", error);
			setMessage("Error de conexión. Intenta de nuevo.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleLogout = () => {
		logout();
		router.push("/ecommers/login");
	};

	if (!usuario) {
		return <div className="perfil-loading">Cargando...</div>;
	}

	return (
		<main className="perfil-container">
			<div className="perfil-header">
				<h1>Mi Perfil</h1>
				<p>Gestiona tu información personal y configuración de cuenta</p>
			</div>

			<div className="perfil-content">
				{/* Avatar */}
				<div className="perfil-avatar-section">
					<div className="perfil-avatar">
						{usuario.nombre?.charAt(0).toUpperCase() || "U"}
					</div>
					<div className="perfil-avatar-info">
						<h2>{usuario.nombre}</h2>
						<p>{usuario.email}</p>
					</div>
				</div>

				{/* Mensaje */}
				{message && (
					<div className={`perfil-message ${message.includes("✅") ? "success" : "error"}`}>
						{message}
					</div>
				)}

				{/* Formulario */}
				<div className="perfil-form-section">
					<div className="perfil-form-header">
						<h3>Información Personal</h3>
						{!isEditing && (
							<button
								className="perfil-btn-edit"
								onClick={() => setIsEditing(true)}
							>
								Editar
							</button>
						)}
					</div>

					{isEditing ? (
						<form className="perfil-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
							<div className="perfil-form-group">
								<label>Nombre completo *</label>
								<input
									type="text"
									name="nombre"
									value={formData.nombre}
									onChange={handleChange}
									placeholder="Tu nombre"
									required
									className="perfil-input"
								/>
							</div>

							<div className="perfil-form-group">
								<label>Email * <span className="perfil-email-note">(No editable)</span></label>
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									placeholder="tu@email.com"
									required
									className="perfil-input"
								/>
							</div>

							<div className="perfil-form-group">
								<label>Teléfono</label>
								<input
									type="tel"
									name="telefono"
									value={formData.telefono}
									onChange={handleChange}
									placeholder="+34 123 456 789"
									className="perfil-input"
								/>
							</div>

							<div className="perfil-form-group">
								<label>Dirección</label>
								<input
									type="text"
									name="direccion"
									value={formData.direccion}
									onChange={handleChange}
									placeholder="Calle, número, ciudad"
									className="perfil-input"
								/>
							</div>

							<div className="perfil-form-actions">
								<button
									type="submit"
									className="perfil-btn-save"
									disabled={isLoading}
								>
									{isLoading ? "Guardando..." : "Guardar cambios"}
								</button>
								<button
									type="button"
									className="perfil-btn-cancel"
									onClick={() => setIsEditing(false)}
								>
									Cancelar
								</button>
							</div>
						</form>
					) : (
						<div className="perfil-info-display">
							<div className="perfil-info-row">
								<span className="perfil-label">Nombre:</span>
								<span className="perfil-value">{formData.nombre}</span>
							</div>
							<div className="perfil-info-row">
								<span className="perfil-label">Email:</span>
								<span className="perfil-value">{formData.email}</span>
							</div>
							<div className="perfil-info-row">
								<span className="perfil-label">Teléfono:</span>
								<span className="perfil-value">
									{formData.telefono || "No especificado"}
								</span>
							</div>
							<div className="perfil-info-row">
								<span className="perfil-label">Dirección:</span>
								<span className="perfil-value">
									{formData.direccion || "No especificada"}
								</span>
							</div>
						</div>
					)}
				</div>

				{/* Sección de pedidos (placeholder) */}
				<div className="perfil-orders-section">
					<h3>Mis Pedidos</h3>
					<div className="perfil-empty-state">
						<p>No tienes pedidos aún</p>
						<a href="/ecommers" className="perfil-btn-shop">
							Ir de compras
						</a>
					</div>
				</div>

				{/* Acciones generales */}
				<div className="perfil-actions">
					<button
						className="perfil-btn-logout"
						onClick={handleLogout}
					>
						Cerrar sesión
					</button>
				</div>
			</div>
		</main>
	);
}
