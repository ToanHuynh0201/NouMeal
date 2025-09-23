import {Navigate, Route, BrowserRouter as Router, Routes} from "react-router-dom";
import "./App.css";
import {ROUTES} from "./constants";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                    <Route path={ROUTES.HOME} element={<HomePage />} />
                    <Route
                        path="/"
                        element={<Navigate to={ROUTES.HOME} replace />}
                    />
                    <Route
                        path="*"
                        element={<Navigate to={ROUTES.HOME} replace />}
                    />
                </Routes>
            </Router>
        </>
    );
}

export default App;
