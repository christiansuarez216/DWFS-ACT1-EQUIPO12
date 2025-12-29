import { useMemo } from "react";
import { useTogglePassword } from "../../hooks/useTogglePassword";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function SignUpForm() {
    const { lang } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation("signup");

    const pass = useTogglePassword();

    const validationSchema = useMemo(
        () =>
            Yup.object({
                email: Yup.string()
                    .trim()
                    .email(t("form.email.errors.invalid"))
                    .required(t("form.email.errors.required")),

                name: Yup.string()
                    .trim()
                    .min(3, t("form.name.errors.min"))
                    .max(80, t("form.name.errors.max"))
                    .required(t("form.name.errors.required")),

                password: Yup.string()
                    .min(8, t("form.password.errors.min"))
                    .max(64, t("form.password.errors.max"))
                    .matches(/[A-Z]/, t("form.password.errors.upper"))
                    .matches(/[a-z]/, t("form.password.errors.lower"))
                    .matches(/[0-9]/, t("form.password.errors.number"))
                    .required(t("form.password.errors.required"))
            }),
        [t]
    );

    const formik = useFormik({
        initialValues: {
            email: "",
            name: "",
            password: "",
        },
        validationSchema,
        validateOnBlur: true,
        validateOnChange: false,
        onSubmit: async (values, helpers) => {
            try {
                helpers.setStatus(null);

                const payload = {
                    email: values.email.trim(),
                    name: values.name.trim(),
                    password: values.password
                };

                // Llamado a la API
                console.log("Datos", payload);

                //Redireccion
                navigate(`/${lang}/catalog`);

                helpers.resetForm();
            } catch (err) {
                const data = err?.response?.data;

                if (data?.errors) {
                    Object.entries(data.errors).forEach(([field, messageKeyOrMsg]) => {
                        const translated =
                            typeof messageKeyOrMsg === "string" && messageKeyOrMsg.toUpperCase() === "EMAIL_TAKEN"
                                ? t("form.email.errors.taken")
                                : String(messageKeyOrMsg);

                        helpers.setFieldError(field, translated);
                    });
                } else {
                    helpers.setStatus(t("form.errors.generic"));
                }
            } finally {
                helpers.setSubmitting(false);
            }
        }
    });

    const showError = (field) => Boolean(formik.touched[field] && formik.errors[field]);

    return (
        <form
            id="registro-form"
            className="auth__form"
            noValidate
            aria-label={t("form.aria")}
            onSubmit={formik.handleSubmit}
        >
            <div className="mb-3">
                <label className="auth__label form-label" htmlFor="email">
                    {t("form.email.label")}
                </label>
                <input
                    id="email"
                    name="email"
                    className={`form-control form-control-sm auth__input ${showError("email") ? "is-invalid" : ""}`}
                    type="email"
                    placeholder={t("form.email.placeholder")}
                    autoComplete="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    aria-invalid={showError("email")}
                    aria-describedby={showError("email") ? "email-error" : undefined}
                />
                {showError("email") && (
                    <div id="email-error" className="invalid-feedback">
                        {formik.errors.email}
                    </div>
                )}
            </div>

            <div className="mb-3">
                <label className="auth__label form-label" htmlFor="name">
                    {t("form.name.label")}
                </label>
                <input
                    id="name"
                    name="name"
                    className={`form-control form-control-sm auth__input ${showError("name") ? "is-invalid" : ""}`}
                    type="text"
                    placeholder={t("form.name.placeholder")}
                    autoComplete="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    aria-invalid={showError("name")}
                    aria-describedby={showError("name") ? "name-error" : undefined}
                />
                {showError("name") && (
                    <div id="name-error" className="invalid-feedback">
                        {formik.errors.name}
                    </div>
                )}
            </div>

            <div className="auth__inputGroup mb-3">
                <label className="auth__label form-label" htmlFor="password">
                    {t("form.password.label")}
                </label>

                <div className="auth__inputField">
                    <input
                        id="password"
                        name="password"
                        className={`form-control form-control-sm auth__input pe-5 ${showError("password") ? "is-invalid" : ""
                            }`}
                        type={pass.type}
                        placeholder={t("form.password.placeholder")}
                        autoComplete="new-password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        aria-invalid={showError("password")}
                        aria-describedby={showError("password") ? "password-error" : "password-hint"}
                    />

                    <button
                        type="button"
                        className={`auth__togglePass ${showError("password") ? "auth__togglePass--withError" : ""
                            }`}
                        onClick={pass.toggle}
                        aria-label={pass.type === "text" ? t("form.password.hide") : t("form.password.show")}
                        aria-pressed={pass.type === "text"}
                    >
                        <i className={`far ${pass.icon}`} />
                    </button>
                </div>

                {showError("password") && (
                    <div id="password-error" className="invalid-feedback d-block">
                        {formik.errors.password}
                    </div>
                )}
            </div>


            {formik.status && (
                <div className="alert alert-danger py-2" role="alert">
                    {formik.status}
                </div>
            )}

            <button
                type="submit"
                className="btn auth__submit w-100"
                disabled={formik.isSubmitting}
                aria-busy={formik.isSubmitting}
            >
                {formik.isSubmitting ? (lang === "en" ? "Creating..." : "Creando...") : t("form.submit")}
            </button>

            <p className="auth__footerLine mt-3 mb-0">
                {t("form.footer.question")}{" "}
                <Link to={`/${lang}/auth/sign-in`} className="text-decoration-none">
                    {t("form.footer.link")}
                </Link>
            </p>
        </form>
    );
}
