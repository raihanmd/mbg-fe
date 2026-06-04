import type { OnRpcRequestHandler } from "@metamask/snaps-sdk";
import { Box, Text, Bold } from "@metamask/snaps-sdk/jsx";

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case "not_allowed_dca_btc_by_ai_notify": {
      const { data } = request.params as {
        data?: {
          title?: string;
          reason?: string;
          confidence?: number;
          recommendation?: string;
        };
      };
      return snap.request({
        method: "snap_dialog",
        params: {
          type: "confirmation",
          content: (
            <Box>
              <Text>
                <Bold>{data?.title ?? "N/A"}</Bold>
              </Text>
              <Text>
                Reason: <Bold>{data?.reason ?? "N/A"}</Bold>
              </Text>
              <Text>
                Confidence: <Bold>{data?.confidence?.toString() ?? "N/A"}</Bold>
              </Text>
              <Text>
                Recommendation: <Bold>{data?.recommendation ?? "N/A"}</Bold>
              </Text>
              <Text>
                Origin: <Bold>{origin}</Bold>
              </Text>
            </Box>
          ),
        },
      });
    }
    case "dca": {
      const { asset, amount, schedule } = request.params as {
        asset?: string;
        amount?: string;
        schedule?:
          | { type: "weekly"; day: string }
          | { type: "monthly"; dayOfMonth: number };
      };

      const scheduleText =
        schedule?.type === "weekly"
          ? `Every ${schedule.day}`
          : schedule?.type === "monthly"
            ? `Day ${schedule.dayOfMonth} of each month`
            : "Unknown schedule";

      return snap.request({
        method: "snap_dialog",
        params: {
          type:"confirmation",
          content: (
            <Box>
              <Text>
                <Bold>DCA Skill Request</Bold>
              </Text>
              <Text>
                Asset: <Bold>{asset ?? "N/A"}</Bold>
              </Text>
              <Text>
                Amount: <Bold>{amount ?? "N/A"}</Bold>
              </Text>
              <Text>
                Schedule: <Bold>{scheduleText}</Bold>
              </Text>
              <Text>
                Origin: <Bold>{origin}</Bold>
              </Text>
              <Text>
                This is where AI reasoning and smart account execution will be
                connected next.
              </Text>
            </Box>
          ),
        },
      });
    }

    default:
      throw new Error("Method not found.");
  }
};
