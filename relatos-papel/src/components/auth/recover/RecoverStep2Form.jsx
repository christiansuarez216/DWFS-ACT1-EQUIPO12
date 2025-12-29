import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRecoveryStep2 } from "../../../hooks/useRecoveryStep2";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function RecoverStep2Form() {
  const { lang } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("recover2");

  const {
    code,
    setCode,
    statusMsg,
    setStatusMsg
  } = useRecoveryStep2();

    const validationSchema = Yup.object({
        code: Yup.string()
            .trim()
            .matches(/^\d{6}$/, t("form.code.error"))
            .required(t("form.status.invalid")),
    });

    const formik = useFormik({
        initialValues: {
            code: "",
        },
        validationSchema,
        validateOnBlur: true,
        validateOnChange: false,
        onSubmit: async (values, helpers) => {
            try {
                helpers.setStatus(null);

                const payload = {
                    code: values.code.trim(),
                };

                // Llamado a la API
                console.log("Codigo enviado", payload);

                setCode(values.code); //sincroniza con el HOOK

                setStatusMsg(t("form.status.ok"));

                //Redireccion
                navigate(`/${lang}/auth/recover/step-3`);
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
      <div className="visually-hidden" role="status" aria-live="polite">
        {statusMsg}
      </div>

      <div className="mb-3">
        <label className="auth__label form-label" htmlFor="code">
          {t("form.code.label")}
        </label>

        <input
          className={`form-control form-control-sm auth__input auth__input--code text-center ${
            showError ("code") ? "is-invalid" : ""}`}
          id="code"
          name="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          pattern="[0-9]{6}"
          placeholder={t("form.code.placeholder")}
          value={formik.values.code}
          onChange={(e) =>
              formik.setFieldValue("code", e.target.value.replace(/\D/g, ""))
          }
          onBlur={formik.handleBlur}
          aria-invalid={showError("code")}
          aria-describedby={showError("code") ? "code-error" : undefined}
        />

          {showError("code") && (
              <div id="code-error" className="invalid-feedback">
                  {formik.errors.code}
              </div>
          )}
      </div>

        {formik.status && (
            <div className="alert alert-danger py-2" role="alert">
                {formik.status}
            </div>
        )}


      <button type="submit" className="btn auth__submit w-100"
              id="btnVerificar"
              disabled={formik.isSubmitting}
              aria-busy={formik.isSubmitting}
      >
          {formik.isSubmitting ? "Verificando..." : t("form.submit")}
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