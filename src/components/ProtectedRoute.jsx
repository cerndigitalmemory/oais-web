import { AppContext } from "@/AppContext.js";
import React from "react";
import { Redirect, Route } from "react-router";

export class ProtectedRoute extends React.Component {
  static contextType = AppContext.Context;
  render() {
    const { isLoggedIn } = this.context;
    const { component, render, children, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={(routeProps) => {
          if (!isLoggedIn) {
            // Pass the current URL as a query parameter.
            // After the login, the user will be redirected to the current page.
            const { location } = routeProps;
            const redirect = new URLSearchParams({
              redirect: location.pathname + location.search,
            });

            return (
              <Redirect
                to={{
                  pathname: "/login",
                  search: "?" + redirect.toString(),
                }}
              />
            );
          }

          if (component) {
            const Component = component;
            return <Component {...routeProps} />;
          } else if (render) {
            return render(routeProps);
          } else {
            return children;
          }
        }}
      />
    );
  }
}
