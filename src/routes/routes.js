import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import DataPage from "../pages/DataPage";
import DataDetailPage from "../pages/DataDetailPage";
import ModelPage from "../pages/ModelPage";
import ModelDetailPage from "../pages/ModelDetailPage";
import TrainingPage from "../pages/TrainingPage";
import NotFoundPage from "../pages/NotFoundPage";

export const routes = [
  {
    path: "/",
    element: <HomePage />,
    children: [
      { path: "data", element: <DataPage /> },
      { path: "model", element: <ModelPage /> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/data/:id",
    element: <DataDetailPage />,
  },
  {
    path: "/model/:id",
    element: <ModelDetailPage />,
  },
  {
    path: "/training",
    element: <TrainingPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
