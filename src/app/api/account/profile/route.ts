import { currentUser, publicUser } from "@/lib/server/auth";
import { updateUser } from "@/lib/server/db";
import { jsonError, requiredString } from "@/lib/server/validation";

export async function PATCH(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return Response.json({ error: "Authentication required" }, { status: 401 });
    const body = await request.json();
    const address = {
      address: requiredString(body.address?.address, "Address", 300),
      city: requiredString(body.address?.city, "City", 80),
      state: requiredString(body.address?.state, "State", 80),
      pincode: requiredString(body.address?.pincode, "Pincode", 10),
      country: requiredString(body.address?.country || "India", "Country", 80),
    };
    const updated = await updateUser(user.id, { name: requiredString(body.name, "Name", 120), phone: requiredString(body.phone, "Phone", 30), address });
    return Response.json({ user: updated && publicUser(updated) });
  } catch (error) { return jsonError(error); }
}
