"use client";

import { useMemo, useState } from "react";

import { formatDate } from "@/lib/format";
import { useUserAccount } from "@/hooks/use-user-account";
import type { UserAccountProfile, UserAddress } from "@/types/account";

const createAddressDraft = (): UserAddress => ({
  id: `addr-${Date.now()}`,
  label: "",
  recipient: "",
  phone: "",
  line1: "",
  city: "",
  reference: "",
  isDefault: false,
});

const AccountProfileContent = ({
  profile,
  removeAddress,
  saveAddress,
  updateProfile,
}: {
  profile: UserAccountProfile;
  removeAddress: (addressId: string) => void;
  saveAddress: (address: UserAddress) => void;
  updateProfile: (patch: Partial<UserAccountProfile>) => void;
}) => {
  const [accountForm, setAccountForm] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone,
    preferredContact: profile.preferredContact,
    marketingOptIn: profile.marketingOptIn,
  });
  const [addressDraft, setAddressDraft] = useState<UserAddress>(createAddressDraft());
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [accountMessage, setAccountMessage] = useState<string | null>(null);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [addressMessage, setAddressMessage] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);

  const defaultAddress = useMemo(
    () => profile.addresses.find((address) => address.isDefault),
    [profile.addresses],
  );

  const submitAccount = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAccountError(null);
    setAccountMessage(null);

    if (!accountForm.email.includes("@")) {
      setAccountError("Ingresa un correo valido.");
      return;
    }

    if (accountForm.phone.replace(/\D/g, "").length < 10) {
      setAccountError("Ingresa un telefono valido.");
      return;
    }

    updateProfile({
      ...accountForm,
      phone: accountForm.phone.replace(/\D/g, ""),
    });
    setAccountMessage("Datos de cuenta actualizados.");
  };

  const editAddress = (address: UserAddress) => {
    setEditingAddressId(address.id);
    setAddressDraft(address);
    setAddressError(null);
    setAddressMessage(null);
  };

  const submitAddress = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAddressError(null);
    setAddressMessage(null);

    if (!addressDraft.label || !addressDraft.recipient || !addressDraft.line1 || !addressDraft.city) {
      setAddressError("Completa etiqueta, destinatario, direccion y ciudad.");
      return;
    }

    const normalizedAddress = {
      ...addressDraft,
      phone: addressDraft.phone.replace(/\D/g, ""),
      id: editingAddressId ?? addressDraft.id,
      isDefault: addressDraft.isDefault || profile.addresses.length === 0,
    };

    saveAddress(normalizedAddress);
    setAddressMessage(editingAddressId ? "Direccion actualizada." : "Direccion guardada.");
    setEditingAddressId(null);
    setAddressDraft(createAddressDraft());
  };

  return (
    <div className="space-y-6">
      <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-terracota">
          Datos de cuenta
        </p>
        <h2 className="mt-2 text-3xl font-serif font-bold text-sepia">
          Perfil y contacto
        </h2>
        <p className="mt-2 text-sepia/65">
          Administra tus datos basicos, telefono y preferencias de contacto.
        </p>

        <form className="mt-6 space-y-5" onSubmit={submitAccount}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-sepia">Nombre</span>
              <input
                value={accountForm.firstName}
                onChange={(event) =>
                  setAccountForm((prev) => ({ ...prev, firstName: event.target.value }))
                }
                className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-sepia">Apellido</span>
              <input
                value={accountForm.lastName}
                onChange={(event) =>
                  setAccountForm((prev) => ({ ...prev, lastName: event.target.value }))
                }
                className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-sepia">Correo</span>
              <input
                type="email"
                value={accountForm.email}
                onChange={(event) =>
                  setAccountForm((prev) => ({ ...prev, email: event.target.value }))
                }
                className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-sepia">Telefono</span>
              <input
                value={accountForm.phone}
                onChange={(event) =>
                  setAccountForm((prev) => ({ ...prev, phone: event.target.value }))
                }
                className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-sepia">Canal preferido</span>
              <select
                value={accountForm.preferredContact}
                onChange={(event) =>
                  setAccountForm((prev) => ({
                    ...prev,
                    preferredContact: event.target.value as typeof prev.preferredContact,
                  }))
                }
                className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="telefono">Telefono</option>
                <option value="email">Correo</option>
              </select>
            </label>
            <label className="mt-8 flex items-center gap-2 rounded-xl bg-crema px-4 py-3 text-sm font-semibold text-sepia">
              <input
                type="checkbox"
                checked={accountForm.marketingOptIn}
                onChange={(event) =>
                  setAccountForm((prev) => ({
                    ...prev,
                    marketingOptIn: event.target.checked,
                  }))
                }
              />
              Recibir novedades
            </label>
          </div>

          {accountMessage ? <p className="font-semibold text-olivo">{accountMessage}</p> : null}
          {accountError ? <p className="font-semibold text-rojo-quemado">{accountError}</p> : null}

          <button className="rounded-xl bg-terracota px-5 py-3 font-bold text-crema transition-colors hover:bg-rojo-quemado">
            Guardar datos
          </button>
        </form>
      </article>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-3xl font-serif font-bold text-sepia">Direcciones</h2>
              <p className="mt-2 text-sepia/65">
                Guarda puntos frecuentes para repetir pedidos mas rapido.
              </p>
            </div>
            <span className="rounded-full bg-crema px-3 py-2 text-sm font-semibold text-sepia">
              {profile.addresses.length} guardadas
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {profile.addresses.map((address) => (
              <div
                key={address.id}
                className="rounded-2xl border border-beige-tostado/20 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-sepia">{address.label}</h3>
                      {address.isDefault ? (
                        <span className="rounded-full bg-olivo/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-olivo">
                          Principal
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sepia/75">{address.recipient}</p>
                    <p className="text-sm text-sepia/60">{address.phone}</p>
                    <p className="mt-1 text-sm text-sepia/70">
                      {address.line1}
                      {address.line2 ? `, ${address.line2}` : ""} · {address.city}
                    </p>
                    {address.reference ? (
                      <p className="mt-1 text-sm text-sepia/55">
                        Referencia: {address.reference}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => editAddress(address)}
                      className="rounded-xl border border-beige-tostado/35 px-4 py-2 font-semibold text-sepia"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => removeAddress(address.id)}
                      className="rounded-xl bg-rojo-quemado/10 px-4 py-2 font-semibold text-rojo-quemado"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
          <h2 className="text-3xl font-serif font-bold text-sepia">
            {editingAddressId ? "Editar direccion" : "Nueva direccion"}
          </h2>
          <p className="mt-2 text-sepia/65">
            {defaultAddress
              ? `Direccion principal actual: ${defaultAddress.label}`
              : "Todavia no tienes una direccion principal."}
          </p>

          <form className="mt-5 space-y-4" onSubmit={submitAddress}>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-sepia">Etiqueta</span>
              <input
                value={addressDraft.label}
                onChange={(event) =>
                  setAddressDraft((prev) => ({ ...prev, label: event.target.value }))
                }
                className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-sepia">Destinatario</span>
              <input
                value={addressDraft.recipient}
                onChange={(event) =>
                  setAddressDraft((prev) => ({ ...prev, recipient: event.target.value }))
                }
                className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-sepia">Telefono</span>
                <input
                  value={addressDraft.phone}
                  onChange={(event) =>
                    setAddressDraft((prev) => ({ ...prev, phone: event.target.value }))
                  }
                  className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-sepia">Ciudad</span>
                <input
                  value={addressDraft.city}
                  onChange={(event) =>
                    setAddressDraft((prev) => ({ ...prev, city: event.target.value }))
                  }
                  className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
                />
              </label>
            </div>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-sepia">Direccion</span>
              <input
                value={addressDraft.line1}
                onChange={(event) =>
                  setAddressDraft((prev) => ({ ...prev, line1: event.target.value }))
                }
                className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-sepia">Complemento</span>
              <input
                value={addressDraft.line2 ?? ""}
                onChange={(event) =>
                  setAddressDraft((prev) => ({ ...prev, line2: event.target.value }))
                }
                className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-sepia">Referencia</span>
              <textarea
                value={addressDraft.reference ?? ""}
                onChange={(event) =>
                  setAddressDraft((prev) => ({ ...prev, reference: event.target.value }))
                }
                className="min-h-24 w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
              />
            </label>

            <label className="flex items-center gap-2 rounded-xl bg-crema px-4 py-3 text-sm font-semibold text-sepia">
              <input
                type="checkbox"
                checked={addressDraft.isDefault}
                onChange={(event) =>
                  setAddressDraft((prev) => ({
                    ...prev,
                    isDefault: event.target.checked,
                  }))
                }
              />
              Marcar como principal
            </label>

            {addressMessage ? <p className="font-semibold text-olivo">{addressMessage}</p> : null}
            {addressError ? <p className="font-semibold text-rojo-quemado">{addressError}</p> : null}

            <div className="flex flex-wrap gap-3">
              <button className="rounded-xl bg-terracota px-5 py-3 font-bold text-crema transition-colors hover:bg-rojo-quemado">
                {editingAddressId ? "Guardar cambios" : "Guardar direccion"}
              </button>
              {editingAddressId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingAddressId(null);
                    setAddressDraft(createAddressDraft());
                  }}
                  className="rounded-xl border border-beige-tostado/35 px-5 py-3 font-bold text-sepia"
                >
                  Cancelar
                </button>
              ) : null}
            </div>
          </form>
        </article>
      </div>

      <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-serif font-bold text-sepia">Resumen de cuenta</h2>
        <p className="mt-3 text-sepia/65">
          Miembro desde {formatDate(profile.memberSince)}. Ultima actualizacion de contrasena:{" "}
          {formatDate(profile.passwordUpdatedAt)}.
        </p>
      </article>
    </div>
  );
};

export const AccountProfileManager = () => {
  const { profile, removeAddress, saveAddress, updateProfile } = useUserAccount();

  if (!profile) {
    return null;
  }

  const profileKey = JSON.stringify({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone,
    preferredContact: profile.preferredContact,
    marketingOptIn: profile.marketingOptIn,
    addresses: profile.addresses,
  });

  return (
    <AccountProfileContent
      key={profileKey}
      profile={profile}
      removeAddress={removeAddress}
      saveAddress={saveAddress}
      updateProfile={updateProfile}
    />
  );
};
