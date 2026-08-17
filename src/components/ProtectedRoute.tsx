import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
	children: React.ReactNode;
	allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	children,
	allowedRoles,
}) => {
	const { user, isAuthenticated } = useAuth();
	const location = useLocation();

	if (!isAuthenticated || !user) {
		return <Navigate to="/connexion" state={{ from: location }} replace />;
	}

	if (
		allowedRoles &&
		!allowedRoles.some((role) =>
			user.roles?.map((r) => r.toUpperCase()).includes(role.toUpperCase()),
		)
	) {
		return <Navigate to="/" replace />;
	}

	return <>{children}</>;
};
