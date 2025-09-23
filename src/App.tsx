import {Navigate, Route, BrowserRouter as Router, Routes} from "react-router-dom";
import "./App.css";
import {ROUTES} from "./constants";
import LoginPage from "./pages/LoginPage";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                    <Route
                        path="/"
                        element={<Navigate to={ROUTES.LOGIN} replace />}
                    />
                    <Route
                        path="*"
                        element={<Navigate to={ROUTES.LOGIN} replace />}
                    />
                </Routes>
            </Router>
        </>
    );
}

export default App;
