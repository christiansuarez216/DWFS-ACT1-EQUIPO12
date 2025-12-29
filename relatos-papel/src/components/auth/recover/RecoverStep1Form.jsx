import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRecoveryStep1 } from "../../../hooks/useRecoveryStep1";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function RecoverStep1Form() {
  const { lang } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("recover1");

  const {
    email,
    setEmail,
    statusMsg,
    setStatusMsg
  } = useRecoveryStep1();

    const validationSchema = Yup.object({
        email: Yup.string()
            .trim()
            .email(t("form.email.error"))
            .required(t("form.status.invalid")),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema,
        validateOnBlur: true,
        validateOnChange: false,
        onSubmit: async (values, helpers) => {
            try {
                helpers.setStatus(null);

                const payload = {
                    email: values.email.trim(),
                };

                // Llamado a la API
                console.log("Email", payload);

                setEmail(values.email); //sincroniza con el HOOK

                setStatusMsg(t("form.status.ok"));

                //Redireccion
                navigate(`/${lang}/auth/recover/step-2`);
            } catch (err) {
                setStatusMsg(t("form.status.invalid"));
            } finally {
                helpers.setSubmitting(false);
            }
        },
    });

    const showError = (field) => Boolean(formik.touched[field] && formik.errors[field]);

  return (
    <form
      id="recovery-form"
      className="auth__form"
      noValidate
      aria-label={t("form.aria")}
      onSubmit={formik.handleSubmit}
    >
      <div className="visually-hidden" id="formStatus" role="status" aria-live="polite">
        {statusMsg}
      </div>

      <div className="mb-3">
        <label className="auth__label form-label" htmlFor="email">
          {t("form.email.label")}
        </label>

        <input
          className={`form-control form-control-sm auth__input 
          ${showError("email") ? "is-invalid" : ""}`}
          id="email"
          name="email"
          type="email"
          inputMode="email"
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

        {formik.status && (
            <div className="alert alert-danger py-2" role="alert">
                {formik.status}
            </div>
        )}

      <button type="submit" className="btn auth__submit w-100" id="btnSolicitar"
              disabled={formik.isSubmitting}
              aria-busy={formik.isSubmitting}
      >
          {formik.isSubmitting ? "Validando..." : t("form.submit")}
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