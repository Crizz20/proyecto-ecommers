import React from "react";


export default function PerfilPage() {
	return (
		<main className="store-container">
			<section style={{ padding: "2rem 1rem" }}>
				<h1 style={{ color: "#2dd4bf", fontFamily: "Montserrat, sans-serif" }}>Mi perfil</h1>
				<p style={{ color: "#94a3b8" }}>
					Aquí puedes ver y editar la información de tu cuenta. Esta es una página
					placeholder — reemplaza con tu implementación real.
				</p>
				<div style={{ marginTop: "1.5rem" }}>
					<button className="add-btn" style={{ marginRight: 12 }}>Editar perfil</button>
					<button className="logout-btn">Cerrar sesión</button>
				</div>
			</section>
		</main>
	);
}
