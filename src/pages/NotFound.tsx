
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import TransitionWrapper from "@/components/TransitionWrapper";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <TransitionWrapper>
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="text-center max-w-lg px-4">
          <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
          <p className="text-2xl font-medium mb-6">Страница не найдена</p>
          <p className="text-muted-foreground mb-8">
            Запрашиваемая страница не существует или была перемещена. Пожалуйста, вернитесь на главную страницу.
          </p>
          <Link 
            to="/" 
            className="inline-flex px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    </TransitionWrapper>
  );
};

export default NotFound;
