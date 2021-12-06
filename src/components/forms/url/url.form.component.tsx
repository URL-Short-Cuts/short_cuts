import { Flex, FormControl, FormLabel } from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import StyledButton from "../../button/button.standard/button.standard.component";
import StyledInput from "../input/input.component";
import type { URLFormInterface } from "../../../types/forms/url.d";
import type { FieldInputProps, FormikProps, FormikHelpers } from "formik";
import type { TFunction } from "next-i18next";

interface UrlFormProps {
  t: TFunction;
  validateURL: (url: string) => string | undefined;
  handleSubmit: (
    values: URLFormInterface,
    actions: FormikHelpers<URLFormInterface>
  ) => void;
}

export default function SearchForm({
  t,
  validateURL,
  handleSubmit,
}: UrlFormProps) {
  return (
    <Formik
      initialValues={{ url: "" }}
      onSubmit={handleSubmit}
      validateOnChange={true}
      validateOnBlur={false}
    >
      {({ isSubmitting }) => (
        <Form>
          <Flex justify={"center"} maxWidth={"700px"}>
            <Field name="url" validate={validateURL}>
              {({
                field,
                form,
              }: {
                field: FieldInputProps<URLFormInterface["url"]>;
                form: FormikProps<URLFormInterface>;
              }) => (
                <FormControl isInvalid={form.errors.url !== undefined}>
                  <FormLabel id={"url.label"} htmlFor="url">
                    {t("url.fields.url.fieldLabel")}
                  </FormLabel>
                  <StyledInput
                    {...field}
                    id="url"
                    placeholder={t("url.fields.url.fieldPlaceHolder")}
                    maxWidth={"700px"}
                    autoFocus={true}
                  />
                </FormControl>
              )}
            </Field>
            <StyledButton
              width={["50px", "100px", "100px"]}
              analyticsName="URL: generate shortcut"
              mb={12}
              mt={8}
              ml={3}
              isLoading={isSubmitting}
              type="submit"
            >
              {t("url.buttonText")}
            </StyledButton>
          </Flex>
        </Form>
      )}
    </Formik>
  );
}
