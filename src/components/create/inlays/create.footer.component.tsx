import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import routes from "../../../config/routes";
import Button from "../../button/button.standard/button.standard.component";
import type { TFunction } from "../../../types/translations/hook.types";

export default function RetryButtons({ t }: { t: TFunction }) {
  const buttonWidth = "150px";
  const router = useRouter();

  return (
    <Flex>
      <Button
        mb={2}
        ml={2}
        onClick={() => router.push(routes.home)}
        analyticsName={"Create Another"}
        w={buttonWidth}
      >
        {t("buttons.again")}
      </Button>
    </Flex>
  );
}
