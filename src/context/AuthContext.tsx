import { createContext, useContext, useState } from "react";

// Interface alignée avec votre modèle Java User
export interface User {
	id: number;
	name: string;
	email: string;
	userRole: string;
	isActive: boolean;
	lastLoginAt?: string;
	createdAt?: string;
	updatedAt?: string;
}

interface AuthContextType {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	login: (userData: User, token?: string) => void;
	logout: () => void;
	updateUser: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(() => {
		const savedUser = localStorage.getItem("user");
		return savedUser ? JSON.parse(savedUser) : null;
	});

	const [token, setToken] = useState<string | null>(() => {
		return localStorage.getItem("userToken") || null;
	});

	// Synchronisation des données lors de la connexion
	const login = (userData: User, newToken: string = "fake-jwt-token-mu") => {
		setUser(userData);
		setToken(newToken);
		localStorage.setItem("user", JSON.stringify(userData));
		localStorage.setItem("userToken", newToken);
	};

	// Déconnexion
	const logout = () => {
		setUser(null);
		setToken(null);
		localStorage.removeItem("user");
		localStorage.removeItem("userToken");
	};

	// Permet de mettre à jour le state global (ex: après modification dans ProfileSettings)
	const updateUser = (updatedData: Partial<User>) => {
		if (!user) return;
		const updatedUser = { ...user, ...updatedData };
		setUser(updatedUser);
		localStorage.setItem("user", JSON.stringify(updatedUser));
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				isAuthenticated: !!user,
				login,
				logout,
				updateUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

// Hook personnalisé pour consommer le contexte facilement
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error(
			"useAuth doit être utilisé à l'intérieur d'un AuthProvider",
		);
	}
	return context;
};
