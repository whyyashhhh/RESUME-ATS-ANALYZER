import { Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";

import { DashboardPage } from "./pages/DashboardPage";
import { HistoryPage } from "./pages/HistoryPage";
import { AnalysisResultsPage } from "./pages/AnalysisResultsPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import AIChatPage from "./pages/AIChatPage";



export default function App(){


const hasToken =
Boolean(
localStorage.getItem("access_token")
);



return(


<Routes>


<Route

path="/"

element={

<Navigate

to={
hasToken
?
"/dashboard"
:
"/login"
}

replace

/>

}

/>



<Route

path="/login"

element={<LoginPage/>}

/>



<Route

path="/register"

element={<RegisterPage/>}

/>



<Route

path="/dashboard"

element={

<ProtectedRoute>

<DashboardPage/>

</ProtectedRoute>

}

/>



<Route

path="/analysis/:id"

element={

<ProtectedRoute>

<AnalysisResultsPage/>

</ProtectedRoute>

}

/>



<Route

path="/chat"

element={

<ProtectedRoute>

<AIChatPage/>

</ProtectedRoute>

}

/>



<Route

path="/history"

element={

<ProtectedRoute>

<HistoryPage/>

</ProtectedRoute>

}

/>



<Route

path="*"

element={

<Navigate

to={
hasToken
?
"/dashboard"
:
"/login"
}

replace

/>

}

/>



</Routes>


)

}
