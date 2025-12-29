import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTogglePassword } from "../../../hooks/useTogglePassword";
import { useRecoveryStep3 } from "../../../hooks/useRecoveryStep3";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function RecoverStep3Form() {
  const { lang } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("recover3");

  const np = useTogglePassword();
  const cp = useTogglePassword();

  const {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    statusMsg,
    setStatusMsg
  } = useRecoveryStep3();

    const validationSchema = Yup.object({
        newPassword: Yup.string()
            .min(8, t("form.newPassword.error"))
            .required(t("form.status.invalid")),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("newPassword")], t("form.confirmPassword.error"))
            .required(t("form.status.invalid")),
    });

    const formik = useFormik({
        initialValues: {
            newPassword: "",
            confirmPassword: "",
        },

        validationSchema,
        validateOnBlur: true,
        validateOnChange: false,
        onSubmit: async (values, helpers) => {
            try {
                helpers.setStatus(null);

                const payload = {
                    password: values.newPassword
                };

                // Llamado a la API
                console.log("Nueva contraseña", payload);

                setNewPassword(values.newPassword);
                setConfirmPassword(values.confirmPassword);//sincroniza con el HOOK

                setStatusMsg(t("form.status.ok"));

                //Redireccion
                navigate(`/${lang}/auth/sign-in`);

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
      id="recovery-form-3"
      className="auth__form"
      noValidate
      aria-label={t("form.aria")}
      onSubmit={formik.handleSubmit}
    >
        <div className="visually-hidden" role="status" aria-live="polite">
            {statusMsg}
        </div>

      <div className="mb-3">
        <label className="auth__label form-label" htmlFor="newPassword">
          {t("form.newPassword.label")}
        </label>

        <div className="input-group">
          <input
              className={`form-control form-control-sm auth__input ${
                  showError("newPassword") ? "is-invalid" : ""}`}
            id="newPassword"
            name="newPassword"
            type={np.type}
            placeholder={t("form.newPassword.placeholder")}
              autoComplete="new-password"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={showError("newPassword")}
              aria-describedby={showError("newPassword") ? "newPassword-error" : undefined}
          />

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={np.toggle}
            aria-label={np.type === "password" ? t("form.show") : t("form.hide")}
          >
            < i className={`fa ${np.icon}`}/>
          </button>

            {showError("newPassword") && (
                <div id="newPassword-error" className="invalid-feedback">
                    {formik.errors.newPassword}
                </div>
            )}
        </div>
      </div>

        <div className="mb-3">
            <label className="auth__label form-label" htmlFor="confirmPassword">
                {t("form.confirmPassword.label")}
            </label>
            <div className="input-group">
                <input
                    className={`form-control form-control-sm auth__input ${
                        showError("confirmPassword") ? "is-invalid" : ""}`}
                    id="confirmPassword"
                    name="confirmPassword"
                    type={cp.type}
                    placeholder={t("form.confirmPassword.placeholder")}
                    autoComplete="new-password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    aria-invalid={showError("confirmPassword")}
                    aria-describedby={showError("confirmPassword") ? "confirmPassword-error" : undefined}
                />

                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={cp.toggle}
                    aria-label={cp.type === "password" ? t("form.show") : t("form.hide")}
                >
                    < i className={`fa ${cp.icon}`}/>
                </button>

                {showError("confirmPassword") && (
                    <div id="confirmPassword-error" className="invalid-feedback">
                        {formik.errors.confirmPassword}
                    </div>
                )}
            </div>
        </div>

        {formik.status && (
            <div className="alert alert-danger py-2" role="alert">
                {formik.status}
            </div>
        )}

      <button type="submit" className="btn auth__submit w-100" id="btnActualizar"
              disabled={formik.isSubmitting}
              aria-busy={formik.isSubmitting}
      >
          {formik.isSubmitting ? "Actualizando..." : t("form.submit")}
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