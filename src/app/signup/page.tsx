"use client";

import { useRegisterMutation } from "@/services/api";
import { setToken } from "@/features/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "../login/login.css";
import "@/styles/theme.css";

const SignupSchema = Yup.object().shape({
  username: Yup.string().min(3).required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(4, "Too Short!").required("Required"),
});

export default function SignupPage() {
  const [registerUser, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="login-container">
        <div className="empty-state">
          <CircularProgress />
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <h1 className="login-title">Sign up</h1>

      <Formik
        initialValues={{ username: "", email: "", password: "", rememberMe: false }}
        validationSchema={SignupSchema}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            const res = await registerUser({
              username: values.username,
              email: values.email,
              password: values.password,
            }).unwrap();
            dispatch(setToken(res.token));
            Cookies.set("token", res.token, {
              expires: values.rememberMe ? 30 : 1,
            });
            router.push("/movies");
          } catch (err: any) {
            setErrors({ email: "Registration failed" });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, handleChange, handleBlur, values }) => (
          <Form className="login-form">
            <input
              className="form-input"
              placeholder="Username"
              name="username"
              type="text"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.username && errors.username && (
              <div className="error-text">{errors.username}</div>
            )}

            <input
              className="form-input"
              placeholder="Email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.email && errors.email && (
              <div className="error-text">{errors.email}</div>
            )}

            <input
              className="form-input"
              placeholder="Password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.password && errors.password && (
              <div className="error-text">{errors.password}</div>
            )}

            <label className="remember-me">
              <input
                type="checkbox"
                name="rememberMe"
                onChange={handleChange}
                checked={values.rememberMe}
              />
              Remember me
            </label>

            <button type="submit" className="login-button">
              {isLoading ? (
                <>
                  <span className="loading-spinner">
                    <CircularProgress size={16} color="inherit" />
                  </span>
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </Form>
        )}
      </Formik>

      <div className="wave-container">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="shape-fill"
          ></path>
        </svg>
      </div>
    </div>
  );
}
